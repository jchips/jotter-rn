import { useState } from 'react'
import {
  Modal,
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useAuth, queryClient } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useAppStyles } from '../../styles'
import { ROOT_FOLDER } from '../../hooks/useFolder'
import api from '../../util/api'

const AddTitle = (props) => {
  const { openAddTitle, setOpenAddTitle, type } = props
  let { currentFolder } = props
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const { user } = useAuth()
  const { app, MODAL, buttons } = useAppStyles()
  const { COLORS } = useTheme()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
    },
  })

  const createNoteMutation = useMutation({
    mutationFn: async (newNote) => await api.addNote(newNote),
    onSuccess: (res, newNote) => {
      queryClient.setQueryData(['note', user?.id, newNote.id], newNote)
      queryClient.setQueryData(['notes', user?.id, newNote.folderId], (old) =>
        old ? [...old, res.data] : [res.data]
      )
      setOpenAddTitle(false)
    },
    onError: (err) => {
      setError('Failed to create ' + type)
      console.error(err)
    },
  })

  const createFolderMutation = useMutation({
    mutationFn: async (newFolder) => await api.addFolder(newFolder),
    onSuccess: (res, newFolder) => {
      queryClient.setQueryData(
        ['folders', user?.id, newFolder.parentId],
        (old) => (old ? [...old, res.data] : [res.data])
      )
      setOpenAddTitle(false)
    },
    onError: (err) => {
      setError('Failed to create ' + type)
      console.error(err)
    },
  })

  /**
   * Adds a title to a note or folder
   * Then creates the note or folder
   * @param {Object} titleControl - The input the user types as a title
   * @returns - exits the function if there is no current folder
   */
  const onSubmit = async (titleControl) => {
    if (currentFolder === null) return
    currentFolder = currentFolder?.data ? currentFolder.data : currentFolder
    let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER]
    let parsedPath =
      typeof currentFolder.path === 'string'
        ? JSON.parse(currentFolder.path)
        : currentFolder.path
    let currentFolderPath = currentFolder !== ROOT_FOLDER ? parsedPath : path // parse from db
    path = [...currentFolderPath]

    // Adds current folder to the path
    if (currentFolder !== ROOT_FOLDER) {
      path.push({
        id: currentFolder.id,
      })
    }
    try {
      setError('')
      setSaving(true)
      switch (type) {
        // add note
        case 'note':
          const newNote = {
            title: titleControl.title,
            content: '',
            userId: user.id,
            folderId: currentFolder.id,
          }
          await createNoteMutation.mutateAsync(newNote)
          break
        // add folder
        case 'folder':
          const newFolder = {
            title: titleControl.title,
            userId: user.id,
            parentId: currentFolder.id,
            path,
          }
          await createFolderMutation.mutateAsync(newFolder)
          break
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
      visible={openAddTitle}
      onRequestClose={() => {
        setOpenAddTitle(!openAddTitle)
      }}
    >
      <View style={MODAL.centeredView}>
        <KeyboardAvoidingView behavior='padding' style={{ width: '100%' }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={MODAL.modal}>
              <Text style={app.header}>Add {type}</Text>
              {error ? (
                <View style={app.errorAlert}>
                  <Text style={app.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Add note title */}
              <View style={MODAL.controllerContainer}>
                <Controller
                  name='title'
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder={`Give ${type} a title`}
                      placeholderTextColor={COLORS.placeHolderText}
                      style={app.input}
                      autoCapitalize='none'
                      autoCorrect={false}
                      onSubmitEditing={handleSubmit(onSubmit)}
                    />
                  )}
                />
                {errors.title && (
                  <Text style={app.formErrorText}>This field is required.</Text>
                )}
              </View>

              {/* Modal footer */}
              <View style={MODAL.buttons}>
                {/* Cancel button */}
                <Pressable
                  style={[buttons.outlineBtn2, MODAL.button]}
                  onPress={() => {
                    setOpenAddTitle(!openAddTitle)
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
                    backgroundColor: saving
                      ? COLORS.disabled
                      : COLORS.themePurple,
                  }}
                  onPress={handleSubmit(onSubmit)}
                  disabled={saving}
                >
                  <Text style={buttons.btnText4}>Create {type}</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({})

export default AddTitle
