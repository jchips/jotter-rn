import { useState } from 'react'
import { Modal, StyleSheet, View, Text, Pressable, Image } from 'react-native'
import { useMutation } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { removeRecent } from '../../reducers/recentsReducer'
import { queryClient, useAuth } from '../../contexts/AuthContext'
import api from '../../util/api'
import { moderateScale } from '../../util/scaling'
import { useTheme } from '../../contexts/ThemeContext'
import { useAppStyles } from '../../styles'
import { FONT, FONTSIZE } from '../../styles'

const Delete = (props) => {
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const { app, MODAL, buttons } = useAppStyles()
  const { COLORS } = useTheme()
  const { user } = useAuth()
  const dispatch = useDispatch()
  const styles = styleSheet(app, COLORS)
  const { openDelete, setOpenDelete, note, folder } = props

  /* Delete note */
  const deleteNoteMutation = useMutation({
    mutationFn: async (note) => {
      await api.deleteNote(note.id)
      return note
    },
    onMutate: async (note) => {
      await queryClient.cancelQueries(['notes', user?.id, note.id])
      const previousNotes = queryClient.getQueryData([
        'notes',
        user?.id,
        note.folderId,
      ])

      queryClient.setQueryData(
        ['notes', user?.id, note.folderId],
        (oldNotes = []) => oldNotes.filter((n) => n.id !== note.id)
      )

      queryClient.cancelQueries(['note', user?.id, note.id])

      dispatch(removeRecent({ noteId: note.id }))

      return { previousNotes }
    },
    onSuccess: () => {
      setOpenDelete(false)
    },
    onError: (err, note, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(
          ['notes', user?.id, note.folderId],
          context.previousNotes
        )
      }
      console.error('Delete note failed:', err)
      setError('Failed to delete ' + (note ? 'note' : 'folder'))
    },
  })

  /* Delete folder */
  const deleteFolderMutation = useMutation({
    mutationFn: async ({ folderId, folder }) => {
      await api.deleteFolder(folderId)
      return { folderId, folder }
    },
    onMutate: async ({ folderId, folder }) => {
      await queryClient.cancelQueries(['folders', user?.id, folderId])
      const previousFolders = queryClient.getQueryData([
        'folders',
        user?.id,
        folder.parentId,
      ])

      queryClient.setQueryData(
        ['folders', user?.id, folder.parentId],
        (oldFolders = []) => oldFolders.filter((f) => f.id !== folderId)
      )

      return { previousFolders }
    },
    onSuccess: () => {
      setOpenDelete(false)
    },
    onError: (err, { folder }, context) => {
      if (context?.previousFolders) {
        queryClient.setQueryData(
          ['folders', user?.id, folder.parentId],
          context.previousFolders
        )
      }
      console.error('Delete folder failed:', err)
      setError('Failed to delete ' + (note ? 'note' : 'folder'))
    },
  })

  // Deletes the note or folder (and all its contents)
  const handleSubmit = async () => {
    try {
      setError('')
      setSaving(true)
      if (note) {
        await deleteNoteMutation.mutateAsync(note)
      } else {
        await deleteFolderMutation.mutateAsync({ folderId: folder.id, folder })
      }
    } catch (err) {
      // Handled in onError
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={openDelete}
      onRequestClose={() => {
        setOpenDelete(!openDelete)
      }}
    >
      <View style={MODAL.centeredView}>
        <View style={MODAL.modal}>
          <Text style={styles.header}>Delete</Text>
          <View style={styles.modalContainer}>
            {/* Err message */}
            {error ? (
              <View style={app.errorAlert}>
                <Text style={app.errorText}>{error}</Text>
              </View>
            ) : null}

            <Text style={styles.modalText}>
              Are you sure that you want to delete{' '}
              <Text style={{ color: COLORS.themePurpleText, ...app.boldText }}>
                {note?.title || folder?.title}
              </Text>
              ?
            </Text>
            <View style={styles.warningContainer}>
              <Image
                source={{
                  uri: `https://img.icons8.com/material-outlined/100/${COLORS.dangerNH}/info--v1.png`,
                }}
                alt='warning-icon'
                style={styles.icon}
              />
              {folder ? (
                <Text style={styles.warningNote}>
                  This will delete all folders and notes stored within{' '}
                  <Text style={app.boldText}>
                    {note?.title || folder?.title}
                  </Text>
                  .
                </Text>
              ) : (
                <Text style={styles.warningNote}>
                  This action cannot be undone.
                </Text>
              )}
            </View>
          </View>

          {/* Modal footer */}
          <View style={MODAL.buttons}>
            {/* Cancel button */}
            <Pressable
              style={[buttons.outlineBtn2, MODAL.button]}
              onPress={() => {
                setOpenDelete(!openDelete)
                setError('')
              }}
            >
              <Text style={buttons.btnText2}>Cancel</Text>
            </Pressable>

            {/* Submit button */}
            <Pressable
              style={{
                ...buttons.btn1,
                ...MODAL.button,
                backgroundColor: saving ? COLORS.disabled : COLORS.themePurple,
              }}
              onPress={handleSubmit}
              disabled={saving}
            >
              <Text style={buttons.btnText4}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styleSheet = (app, COLORS) =>
  StyleSheet.create({
    header: {
      ...app.header,
      marginBottom: 15,
    },
    modalContainer: {
      width: '100%',
      paddingHorizontal: 10,
    },
    modalText: {
      fontFamily: FONT.regular,
      lineHeight: moderateScale(19),
      width: '100%',
      color: COLORS.text,
    },
    warningContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    warningNote: {
      fontFamily: FONT.semiBold,
      fontSize: moderateScale(FONTSIZE.smaller),
      marginVertical: 25,
      width: '90%',
      marginLeft: 3,
      color: COLORS.text,
    },
    icon: {
      height: 27,
      width: 27,
      marginRight: 3,
    },
  })

export default Delete
