import { useState } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Text,
  TextInput,
  Pressable,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppStyles } from '../../styles';
import api from '../../util/api';

const Rename = ({
  openRename,
  setOpenRename,
  notes,
  setNotes,
  note,
  folders,
  setFolders,
  folder,
}) => {
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { app, MODAL, buttons } = useAppStyles();
  const { COLORS } = useTheme();

  /**
   * Changes the title of a note or folder
   * @param {Object} title - The input the user types as a title
   */
  const onSubmit = async (title) => {
    try {
      setError('');
      setSaving(true);
      let res;
      if (note) {
        res = await api.updateNote(
          {
            title: title.rename,
            updatedAt: Date.now(),
          },
          note.id
        );
        let notesCopy = [...notes];
        notesCopy.splice(notes.indexOf(note), 1, res.data);
        setNotes(notesCopy);
      } else if (folder) {
        res = await api.updateFolder(
          {
            title: title.rename,
            updatedAt: Date.now(),
          },
          folder.id
        );
        let foldersCopy = [...folders];
        foldersCopy.splice(folders.indexOf(folder), 1, res.data);
        setFolders(foldersCopy);
      }
    } catch (err) {
      setError('Failed to rename');
      console.error('Failed to rename: ', err);
    }
    reset({
      title: '',
    });
    setOpenRename(false);
    setSaving(false);
  };

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={openRename}
      onRequestClose={() => {
        setOpenRename(!openRename);
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
          <View style={MODAL.buttons}>
            <Pressable
              style={[buttons.outlineBtn1, MODAL.button]}
              onPress={() => {
                setOpenRename(!openRename);
                setError('');
              }}
            >
              <Text style={buttons.btnText2}>Cancel</Text>
            </Pressable>
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
  );
};

const styles = StyleSheet.create({});

export default Rename;
