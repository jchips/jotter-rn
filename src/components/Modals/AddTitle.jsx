import { useState } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppStyles } from '../../styles';
import { ROOT_FOLDER } from '../../hooks/useFolder';
import api from '../../util/api';
// import { app, COLORS, MODAL, buttons } from '../../styles';

const AddTitle = (props) => {
  const {
    openAddTitle,
    setOpenAddTitle,
    type,
    notes,
    setNotes,
    folders,
    setFolders,
  } = props;
  let { currentFolder } = props;
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { app, MODAL, buttons } = useAppStyles();
  const { COLORS } = useTheme();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
    },
  });

  /**
   * Adds a title to a note or folder
   * Then creates the note or folder
   * @param {Object} titleControl - The input the user types as a title
   * @returns - exits the function if there is no current folder
   */
  const onSubmit = async (titleControl) => {
    if (currentFolder === null) return;
    currentFolder = currentFolder?.data ? currentFolder.data : currentFolder;
    let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER];
    let parsedPath =
      typeof currentFolder.path === 'string'
        ? JSON.parse(currentFolder.path)
        : currentFolder.path;
    let currentFolderPath = currentFolder !== ROOT_FOLDER ? parsedPath : path; // parse from db
    path = [...currentFolderPath];

    // Adds current folder to the path
    if (currentFolder !== ROOT_FOLDER) {
      path.push({
        id: currentFolder.id,
        title: currentFolder.title,
      });
    }
    try {
      setError('');
      setSaving(true);
      let res;
      switch (type) {
        // add note
        case 'note':
          res = await api.addNote({
            title: titleControl.title,
            content: '',
            userId: user.id,
            folderId: currentFolder.id,
          });
          setNotes([res.data, ...notes]);
          break;
        // add folder
        case 'folder':
          res = await api.addFolder({
            title: titleControl.title,
            userId: user.id,
            parentId: currentFolder.id,
            path,
          });
          setFolders([res.data, ...folders]);
          break;
      }
      setOpenAddTitle(false);
    } catch (err) {
      setError('Failed to create ' + type);
      console.error(err);
    }
    reset({
      title: '',
    });
    setSaving(false);
  };

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={openAddTitle}
      onRequestClose={() => {
        setOpenAddTitle(!openAddTitle);
      }}
    >
      <View style={MODAL.centeredView}>
        <View style={MODAL.modal}>
          <Text style={app.header}>Add {type}</Text>
          {error ? (
            <View style={app.errorAlert}>
              <Text>{error}</Text>
            </View>
          ) : null}
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
              <Text style={app.errorText}>This field is required.</Text>
            )}
          </View>
          <View style={MODAL.buttons}>
            <Pressable
              style={[buttons.outlineBtn1, MODAL.button]}
              onPress={() => setOpenAddTitle(!openAddTitle)}
            >
              <Text style={buttons.btnText2}>Cancel</Text>
            </Pressable>
            <Pressable
              style={{
                ...buttons.btn1,
                ...MODAL.button,
                backgroundColor: saving ? COLORS.btn1Hover : COLORS.themePurple,
              }}
              onPress={handleSubmit(onSubmit)}
              disabled={saving}
            >
              <Text style={buttons.btnText4}>Create {type}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({});

export default AddTitle;
