import { useState } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import api from '../../util/api';
import { useTheme } from '../../contexts/ThemeContext';
import { queryClient, useAuth } from '../../contexts/AuthContext';
import { useAppStyles } from '../../styles';

const SaveButton = ({ note, markdown, setError, setSaved, setNoteContent }) => {
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { app, buttons } = useAppStyles();
  const { COLORS } = useTheme();
  const styles = styleSheet(buttons);
  const userId = !user?.id ? null : user.id;

  // Update Notes cache (refresh screen instantly)
  const updateNoteMutation = useMutation({
    mutationFn: async ({ noteId, markdown }) => {
      setSaving(true);
      const res = await api.updateNote(
        {
          content: markdown,
          updatedAt: Date.now(),
        },
        noteId
      );
      setNoteContent(res.data.content);
      return res.data;
    },
    onSuccess: (updatedNote) => {
      queryClient.setQueryData(
        ['notes', userId, updatedNote.folderId],
        (oldNotes) => {
          if (oldNotes) {
            return oldNotes.map((note) =>
              note.id === updatedNote.id ? updatedNote : note
            );
          }
        }
      );
      queryClient.setQueryData(['note', userId, updatedNote.id], updatedNote);
      setSaving(false);
      setSaved(true);
    },
    onError: (err) => {
      console.error('Failed to save changes', err);
      setError('Failed to save changes');
      if (err?.response?.data?.message === 'jwt expired') {
        logUserOut();
      }
      setSaving(false);
      setSaved(false);
    },
  });

  // Saves note to db
  const saveNote = async () => {
    try {
      setError('');
      const noteId = note?.id;
      if (noteId) {
        updateNoteMutation.mutate({ noteId, markdown });
      }
    } catch (err) {
      setError('Failed to save changes');
      console.error('Failed to save changes', err);
      setSaved(false);
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
