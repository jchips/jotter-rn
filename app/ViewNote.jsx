import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  useWindowDimensions,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useQuery } from '@tanstack/react-query';
import { runOnJS } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { useMarkdown } from '../src/contexts/MDContext';
import { useTheme } from '../src/contexts/ThemeContext';
import Loading from '../src/components/indicators/Loading';
import Preview from '../src/components/PreviewMarkdown';
import EditButton from '../src/components/buttons/EditButton';
import { useAuth, queryClient } from '../src/contexts/AuthContext';
import { useAppStyles } from '../src/styles';
import api from '../src/util/api';

const ViewNote = ({ navigation, route }) => {
  const { noteId, title, folderId } = route.params;
  const [editBtnVisible, setEditBtnVisible] = useState(true);
  const { markdown, setMarkdown } = useMarkdown();
  const { app } = useAppStyles();
  const { COLORS } = useTheme();
  const { user, isLoggedIn } = useAuth();
  const { width: screenWidth } = useWindowDimensions();
  const styles = styleSheet(app);
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(180)
    .maxDelay(180)
    .onEnd(() => {
      runOnJS(setEditBtnVisible)(true);
    });

  const calculateHeaderLength = (title) => {
    if (screenWidth < 380 && title.length > 24) {
      return title.substring(0, 22) + '...';
    } else if (screenWidth < 440 && title.length > 26) {
      return title.substring(0, 24) + '...';
    } else {
      return title;
    }
  };

  const { data: note, isLoading } = useQuery({
    queryKey: ['note', user?.id, noteId],
    enabled: isLoggedIn && !!user?.id,
    queryFn: () =>
      api
        .getNote(noteId)
        .then((res) => res.data)
        .catch((err) => {
          throw err;
        }),
    initialData: () => {
      return queryClient.getQueryData(['note', user?.id, noteId]);
    },
    staleTime: 2 * 60 * 1000,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: calculateHeaderLength(note?.title || title),
      headerTint: COLORS.themePurpleText,
    });
  }, [navigation, note, title]);

  useEffect(() => {
    if (!note) return;
    setMarkdown(note.content);
  }, [note]);

  useFocusEffect(
    React.useCallback(() => {
      const timer = setTimeout(() => {
        setEditBtnVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }, [doubleTap]),
  );

  return (
    <View style={styles.container}>
      {note ? (
        <View style={{ flex: 1 }}>
          <GestureDetector gesture={doubleTap}>
            <Preview note={note} markdown={markdown} />
          </GestureDetector>
          <EditButton
            navigation={navigation}
            note={note}
            editBtnVisible={editBtnVisible}
          />
        </View>
      ) : (
        <Loading />
      )}
    </View>
  );
};

const styleSheet = (app) =>
  StyleSheet.create({
    container: {
      ...app.container,
      paddingVertical: 10,
    },
    editBtn: {
      position: 'absolute',
      bottom: 0,
      left: 0,
    },
  });

export default ViewNote;
