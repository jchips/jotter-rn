import { useState } from 'react'
import {
  StyleSheet,
  View,
  Modal,
  Text,
  TextInput,
  Pressable,
} from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { queryClient, useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useAppStyles } from '../../styles'
import api from '../../util/api'

const Rename = ({ openRename, setOpenRename, note, folder }) => {
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const { user } = useAuth()
  const { app, MODAL, buttons } = useAppStyles()
  const { COLORS } = useTheme()

  // Update note in database and cache
  const updateNoteMutation = useMutation({
    mutationFn: async ({ noteId, title }) =>
      await api.updateNote(
        {
          title: title.rename,
          updatedAt: Date.now(),
        },
        noteId
      ),
    onSuccess: (res) => {
      queryClient.setQueryData(
        ['notes', user?.id, res.data.folderId],
        (oldNotes) =>
          oldNotes.map((note) => (note.id === res.data.id ? res.data : note))
      )
      setOpenRename(false)
    },
    onError: (err) => {
      console.error('Failed to rename note', err)
      setError('Failed to rename note')
      setSaving(false)
    },
  })

  // Update folder in database and cache
  const updateFolderMutation = useMutation({
    mutationFn: async ({ folderId, title }) =>
      await api.updateFolder(
        {
          title: title.rename,
          updatedAt: Date.now(),
        },
        folderId
      ),
    onSuccess: (res) => {
      queryClient.setQueryData(
        ['folders', user?.id, res.data.parentId],
        (oldFolders) =>
          oldFolders.map((folder) =>
            folder.id === res.data.id ? res.data : folder
          )
      )
      setOpenRename(false)
    },
    onError: (err) => {
      console.error('Failed to rename folder', err)
      setError('Failed to rename folder')
      setSaving(false)
    },
  })

  /**
   * Changes the title of a note or folder
   * @param {Object} title - The input the user types as a title
   */
  const onSubmit = async (title) => {
    try {
      setError('')
      setSaving(true)
      if (note) {
        const noteId = note.id
        updateNoteMutation.mutate({ noteId, title })
      } else if (folder) {
        const folderId = folder.id
        updateFolderMutation.mutate({ folderId, title })
      }
    } catch (err) {
      // Handled in onError
    }
    reset({
      title: '',
    })
    setSaving(false)
  }

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={openRename}
      onRequestClose={() => {
        setOpenRename(!openRename)
      }}
    >
      <View style={MODAL.centeredView}>
        <View style={MODAL.modal}>
          <Text style={app.header}>
            Rename{' '}
            <Text style={{ color: COLORS.themePurpleText }}>
              {note ? note?.title : folder?.title}
            </Text>
          </Text>
          {error ? (
            <View style={app.errorAlert}>
              <Text style={app.errorText}>{error}</Text>
            </View>
          ) : null}
          <View style={MODAL.controllerContainer}>
            <Controller
              name='rename'
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  defaultValue={note ? note?.title : folder?.title}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  style={app.input}
                  autoCapitalize='none'
                  autoCorrect={false}
                  onSubmitEditing={handleSubmit(onSubmit)}
                />
              )}
            />
            {errors.rename && (
              <Text style={app.formErrorText}>This field is required.</Text>
            )}
          </View>

          {/* Modal footer */}
          <View style={MODAL.buttons}>
            {/* Cancel button */}
            <Pressable
              style={[buttons.outlineBtn2, MODAL.button]}
              onPress={() => {
                setOpenRename(!openRename)
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
              onPress={handleSubmit(onSubmit)}
              disabled={saving}
            >
              <Text style={buttons.btnText4}>Rename</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({})

export default Rename
