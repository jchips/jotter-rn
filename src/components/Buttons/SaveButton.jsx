import { useState } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import api from '../../util/api';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppStyles } from '../../styles';

const SaveButton = ({ note, markdown, setError }) => {
  const [saving, setSaving] = useState(false);
  const { app, buttons } = useAppStyles();
  const { COLORS } = useTheme();
  const styles = styleSheet(buttons);

  // Saves note to db
  const saveNote = async () => {
    try {
      setError('');
      setSaving(true);
      await api.updateNote(
        {
          content: markdown,
          updatedAt: Date.now(),
        },
        note.id
      );
    } catch (err) {
      setError('Failed to save changes');
      console.error('Failed to save changes', err);
    }
    setSaving(false);
  };

  return (
    <Pressable
      disabled={saving}
      onPress={saveNote}
      style={{
        ...styles.saveButton,
        backgroundColor: saving ? `${COLORS.subtle}` : `${COLORS.background}`,
      }}
    >
      <Image
        source={{
          uri: `https://img.icons8.com/material-outlined/100/${COLORS.themeBtnNH}/save.png`,
        }}
        alt='save-button'
        style={app.icon}
      />
    </Pressable>
  );
};

const styleSheet = (buttons) =>
  StyleSheet.create({
    saveButton: {
      ...buttons.outlineBtn1,
      flex: 1,
      height: 40,
      marginVertical: 0,
      marginHorizontal: 10,
    },
  });

export default SaveButton;
