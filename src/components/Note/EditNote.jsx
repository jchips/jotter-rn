import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { moderateScale } from '../../util/scaling';
import { useTheme } from '../../contexts/ThemeContext';
import { FONT, FONTSIZE } from '../../styles';

const EditNote = (props) => {
  const { isEditable, markdown, update } = props;
  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
  });
  const { COLORS } = useTheme();
  const styles = styleSheet(COLORS);

  const handleSelectionChange = ({ nativeEvent: { selection } }) => {
    setSelection(selection);
  };

  return (
    <KeyboardAvoidingView
      behavior='position'
      style={{ flex: 1 }}
      // keyboardVerticalOffset={15}
    >
      {!isEditable ? (
        <ScrollView style={{ marginBottom: 15 }}>
          <View style={{ flex: 1 }}>
            {markdown ? (
              <Text style={styles.editor}>{markdown}</Text>
            ) : (
              <Text style={styles.placeholderText}>
                Double tap to add markdown...
              </Text>
            )}
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={{ marginBottom: 15 }}>
          <TextInput
            style={styles.textInput}
            multiline
            value={markdown}
            onChangeText={update}
            selection={selection}
            onSelectionChange={handleSelectionChange}
            placeholder='Add markdown...'
            placeholderTextColor={COLORS.placeHolderText}
            onBlur={() =>
              setSelection({
                start: selection,
                end: selection,
              })
            }
            onLayout={() =>
              setSelection({
                start: selection,
                end: selection,
              })
            }
          />
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
};

// const styles = StyleSheet.create({
const styleSheet = (COLORS) =>
  StyleSheet.create({
    editor: {
      color: COLORS.text,
      fontFamily: FONT.code,
      fontSize: moderateScale(FONTSIZE.regular),
      marginBottom: 5,
      whiteSpace: 'pre-wrap',
    },
    placeholderText: {
      color: COLORS.mutedtext,
      fontFamily: FONT.code,
      fontSize: moderateScale(FONTSIZE.small),
    },
    textInput: {
      color: COLORS.text,
      fontFamily: FONT.code,
      fontSize: moderateScale(FONTSIZE.regular),
      marginBottom: 5,
      paddingBottom: 10,
      whiteSpace: 'pre-wrap',
    },
  });

export default EditNote;
