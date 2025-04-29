import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { useMarkdown } from '../../contexts/MDContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppStyles } from '../../styles';
import Preview from './Preview';
import EditNote from './EditNote';
import SaveButton from '../Buttons/SaveButton';
import TogglePreview from '../Buttons/TogglePreview';
import getWordCount from '../../util/getWordCount';
import { moderateScale } from '../../util/scaling';
import { FONT, FONTSIZE } from '../../styles';
const screenWidth = Dimensions.get('window').width;

const Editor = ({ navigation, route }) => {
  const { note } = route.params;
  const configs = useSelector((state) => state.configs.data);
  const [error, setError] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [showPreview, setShowPreview] = useState(!configs?.hidePreview);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const { markdown, setMarkdown } = useMarkdown();
  const [words, setWords] = useState(getWordCount(markdown));
  const { app, buttons } = useAppStyles();
  const { COLORS } = useTheme();
  const styles = styleSheet(app, buttons, COLORS);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(setIsEditable)(true);
    });

  const calculateHeaderLength = () => {
    if (
      screenWidth < 380 &&
      note.title.length > 10 &&
      !configs?.hideWordCount
    ) {
      return note.title.substring(0, 8) + '...';
    } else if (
      screenWidth < 380 &&
      note.title.length > 12 &&
      configs?.hideWordCount
    ) {
      return note.title.substring(0, 10) + '...';
    } else if (
      screenWidth < 440 &&
      note.title.length > 12 &&
      !configs?.hideWordCount
    ) {
      return note.title.substring(0, 9) + '...';
    } else if (
      screenWidth < 440 &&
      note.title.length > 14 &&
      configs?.hideWordCount
    ) {
      return note.title.substring(0, 12) + '...';
    } else {
      return note.title;
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: calculateHeaderLength(),
      headerRight: () => {
        return (
          <>
            {!configs?.hideWordCount ? (
              <Text style={styles.words}>{words} words</Text>
            ) : null}
            <View style={styles.headerBtns}>
              <Pressable
                onPress={undo}
                disabled={undoStack.length < 1}
                style={{
                  ...styles.headerBtn,
                  backgroundColor:
                    undoStack?.length < 1 ? COLORS.subtle : COLORS.background,
                }}
              >
                <Image
                  source={{
                    uri: `https://img.icons8.com/material-outlined/100/${COLORS.themeBtnNH}/undo.png`,
                  }}
                  alt='undo-button'
                  style={app.icon}
                />
              </Pressable>
              <Pressable
                onPress={redo}
                disabled={redoStack.length < 1}
                style={{
                  ...styles.headerBtn,
                  backgroundColor:
                    redoStack?.length < 1 ? COLORS.subtle : COLORS.background,
                }}
              >
                <Image
                  source={{
                    uri: `https://img.icons8.com/material-outlined/100/${COLORS.themeBtnNH}/redo.png`,
                  }}
                  alt='redo-button'
                  style={app.icon}
                />
              </Pressable>
            </View>
          </>
        );
      },
    });
  }, [navigation, undoStack, redoStack]);

  // Clean up function to reset undo and redo stacks
  useEffect(() => {
    return () => {
      setUndoStack([]);
      setRedoStack([]);
    };
  }, []);

  /**
   * Updates the markdown content with every change the user makes
   * Auto-generates bullet points and number lists
   * Adds to the undo/redo stacks
   * @param {String} value - The current markdown content
   * @returns - exits the function
   */
  const update = (value) => {
    const lines = value.split('\n');
    const lastLine = lines[lines.length - 1] || '';
    const secondLastLine = lines[lines.length - 2] || '';
    let digit = /^(\d+)\.$/;

    if (lines.length > 1) {
      if (
        lastLine === '' &&
        secondLastLine !== '-' &&
        secondLastLine !== '*' &&
        !secondLastLine.match(digit) &&
        secondLastLine !== ''
      ) {
        if (secondLastLine.startsWith('* ')) {
          const newValue = value + '* ';
          setMarkdown(newValue);
          return;
        }
        if (secondLastLine.startsWith('- ')) {
          const newValue = value + '- ';
          setMarkdown(newValue);
          return;
        }
        const match = secondLastLine.match(/^(\d+)\. /);
        if (match) {
          const count = parseInt(match[1], 10);
          const newValue = value + `${count + 1}. `;
          setMarkdown(newValue);
          return;
        }
      } else if (secondLastLine === '-' && lastLine === '') {
        lines.splice(lines.length - 2, 1);
        const newValue = lines.join('\n');
        setMarkdown(newValue);
        return;
      } else if (secondLastLine === '*' && lastLine === '') {
        lines.splice(lines.length - 2, 1);
        const newValue = lines.join('\n');
        setMarkdown(newValue);
        return;
      } else if (secondLastLine.match(digit) && lastLine === '') {
        lines.splice(lines.length - 2, 1);
        const newValue = lines.join('\n');
        setMarkdown(newValue);
        return;
      }
    }

    setUndoStack([...undoStack, markdown]);
    setMarkdown(value);
    setRedoStack([]);
    setWords(getWordCount(value));
  };

  /**
   * (LIFO)
   * Add current markdown to redo stack
   * Set markdown to previous update
   * Remove last item (previous update) from undo stack
   */
  const undo = () => {
    if (undoStack.length > 0) {
      const prev = undoStack.pop();
      setRedoStack([markdown, ...redoStack]);
      setMarkdown(prev);
      setUndoStack([...undoStack]);
    }
  };

  /**
   * (LIFO)
   * Add current markdown to undo stack
   * Set markdown to next update
   * Remove the first item (next update) from redo stack
   */
  const redo = () => {
    if (redoStack.length > 0) {
      const next = redoStack[0];
      setUndoStack([...undoStack, markdown]);
      setMarkdown(next);
      setRedoStack(redoStack.slice(1));
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {error ? (
        <View style={app.errorAlert}>
          <Text style={app.errorText}>{error}</Text>
        </View>
      ) : null}
      {showPreview ? <Preview markdown={markdown} /> : null}
      <GestureDetector gesture={doubleTap}>
        <View style={styles.editorContainer}>
          <EditNote
            isEditable={isEditable}
            markdown={markdown}
            setIsEditable={setIsEditable}
            update={update}
            doubleTap={doubleTap}
          />
        </View>
      </GestureDetector>
      <View style={styles.footer}>
        <Pressable
          onPress={() => setShowPreview(!showPreview)}
          style={styles.showPreviewBtn}
        >
          <TogglePreview showPreview={showPreview} />
        </Pressable>
        <SaveButton note={note} markdown={markdown} setError={setError} />
      </View>
    </GestureHandlerRootView>
  );
};

const styleSheet = (app, buttons, COLORS) =>
  StyleSheet.create({
    container: {
      ...app.container,
      paddingTop: 10,
      flexDirection: 'column',
    },
    showPreviewBtn: {
      ...buttons.outlineBtn1,
      flex: 1,
      marginHorizontal: 10,
      height: 40,
      marginVertical: 0,
    },
    editorContainer: {
      flex: 1,
      padding: 5,
      borderTopWidth: 1,
      borderColor: COLORS.subtle,
    },
    words: {
      textAlign: 'center',
      fontSize: moderateScale(FONTSIZE.small),
      fontFamily: FONT.regular,
      marginHorizontal: 10,
      color: COLORS.text,
    },
    headerBtns: {
      height: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      paddingRight: 5,
    },
    headerBtn: {
      ...buttons.outlineBtn1,
      height: moderateScale(30),
      width: moderateScale(48),
      marginHorizontal: 2,
    },
    footer: {
      height: 15,
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

export default Editor;
