import { Image, Pressable, StyleSheet } from 'react-native';
import FadeView from 'react-native-fadeview-wrapper';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppStyles } from '../../styles';

const EditButton = ({ navigation, note, editBtnVisible }) => {
  const { app, buttons } = useAppStyles();
  const { COLORS } = useTheme();
  const styles = styleSheet(buttons);
  return (
    <FadeView visible={editBtnVisible}>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Editor', { note: note })}
      >
        <Image
          source={{
            uri: `https://img.icons8.com/material-outlined/100/${COLORS.whiteNH}/edit--v1.png`,
          }}
          alt='edit button'
          style={app.icon}
        />
      </Pressable>
    </FadeView>
  );
};

const styleSheet = (buttons) =>
  StyleSheet.create({
    button: {
      ...buttons.roundBtn,
      marginHorizontal: -5,
      marginVertical: 2,
    },
  });

export default EditButton;
