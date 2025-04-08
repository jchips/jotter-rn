import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { useMarkdown } from '../../contexts/MDContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppStyles } from '../../styles';
import EditButton from '../Buttons/EditButton';
import Preview from './Preview';
// import { app, COLORS } from '../../styles';
const screenWidth = Dimensions.get('window').width;

const ViewNote = ({ navigation, route }) => {
  const { note } = route.params;
  const [editBtnVisible, setEditBtnVisible] = useState(true);
  const { markdown, setMarkdown } = useMarkdown();
  const { app } = useAppStyles();
  const { COLORS } = useTheme();
  const styles = styleSheet(app);
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(setEditBtnVisible)(true);
    });

  const calculateHeaderLength = () => {
    if (screenWidth < 380 && note.title.length > 24) {
      return note.title.substring(0, 22) + '...';
    } else if (screenWidth < 440 && note.title.length > 26) {
      return note.title.substring(0, 24) + '...';
    } else {
      return note.title;
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: calculateHeaderLength(),
      headerTint: COLORS.themePurpleText,
    });
  }, [navigation]);

  useEffect(() => {
    setMarkdown(note.content);
  }, [note]);

  useFocusEffect(
    React.useCallback(() => {
      const timer = setTimeout(() => {
        setEditBtnVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }, [doubleTap])
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={doubleTap}>
        <View style={{ flex: 1 }}>
          <Preview note={note} markdown={markdown} />
          <EditButton
            navigation={navigation}
            note={note}
            editBtnVisible={editBtnVisible}
          />
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

// const styles = StyleSheet.create({
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
