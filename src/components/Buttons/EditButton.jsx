import { Image, Pressable, StyleSheet } from 'react-native';
import FadeView from 'react-native-fadeview-wrapper';
import Animated, {
  withSpring,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppStyles } from '../../styles';

const EditButton = ({ navigation, note, editBtnVisible }) => {
  const { app, buttons } = useAppStyles();
  const { COLORS } = useTheme();
  const styles = styleSheet(buttons);

  // animations
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <FadeView visible={editBtnVisible}>
      <Animated.View style={[animatedStyle, styles.button]}>
        <Pressable
          onPressIn={() => {
            scale.value = withSpring(0.92);
          }}
          onPressOut={() => {
            scale.value = withSpring(1);
          }}
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
      </Animated.View>
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
