import { useRef } from 'react';
import { StyleSheet, Image, Pressable, Text } from 'react-native';
import Popover from 'react-native-popover-view';
import { moderateScale } from '../../util/scaling';
import { useTheme } from '../../contexts/ThemeContext';
import { BORDER, useAppStyles } from '../../styles';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const AddButton = ({ setOpenAddTitle, setType }) => {
  const popoverRef = useRef();
  const { COLORS } = useTheme();
  const { app, buttons, POPOVER } = useAppStyles();
  const styles = styleSheet(COLORS, POPOVER);
  // animations
  const newFolderScale = useSharedValue(1);
  const newNoteScale = useSharedValue(1);
  const newFolderAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: newFolderScale.value }],
  }));
  const newNoteAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: newNoteScale.value }],
  }));

  return (
    <Popover
      ref={popoverRef}
      from={
        <Pressable style={buttons.roundBtn}>
          <Image
            source={{
              uri: `https://img.icons8.com/material-outlined/100/${COLORS.whiteNH}/plus-math--v1.png`,
            }}
            alt='add-icon'
            style={app.icon}
          />
        </Pressable>
      }
      arrowSize={{ width: 0, height: 0 }}
      offset={7}
      popoverStyle={styles.popover}
    >
      <Animated.View
        entering={FadeIn.duration(150)}
        style={POPOVER.popoverContainer}
      >
        {/* Add folder */}
        {/* <Pressable */}
        <AnimatedPressable
          style={[newFolderAnimatedStyle, styles.popoverButton]}
          // style={styles.popoverButton}
          onPress={() => {
            setType('folder');
            setOpenAddTitle(true);
            popoverRef.current.requestClose();
          }}
          onPressIn={() => {
            newFolderScale.value = withSpring(0.97);
          }}
          onPressOut={() => {
            newFolderScale.value = withSpring(1);
          }}
        >
          <Image
            source={{
              uri: `https://img.icons8.com/material-outlined/100/${COLORS.textNH}/folder-invoices--v1.png`,
            }}
            alt='folder-icon'
            style={app.icon}
          />
          <Text style={buttons.btnText2}>New Folder</Text>
        </AnimatedPressable>

        {/* Add note */}
        {/* <Pressable */}
        <AnimatedPressable
          // style={styles.popoverButton}
          style={[newNoteAnimatedStyle, styles.popoverButton]}
          onPress={() => {
            setType('note');
            setOpenAddTitle(true);
            popoverRef.current.requestClose();
          }}
          onPressIn={() => {
            newNoteScale.value = withSpring(0.97);
          }}
          onPressOut={() => {
            newNoteScale.value = withSpring(1);
          }}
        >
          {/* <Animated.View style={[animatedStyle, styles.popoverButton]}> */}
          <Image
            source={{
              uri: `https://img.icons8.com/material-outlined/100/${COLORS.textNH}/file.png`,
            }}
            alt='note-icon'
            style={app.icon}
          />
          <Text style={buttons.btnText2}>New Note</Text>
          {/* </Animated.View> */}
        </AnimatedPressable>
        {/* </Pressable> */}
      </Animated.View>
    </Popover>
  );
};

const styleSheet = (COLORS, POPOVER) =>
  StyleSheet.create({
    popover: {
      borderRadius: BORDER.radius,
      minHeight: moderateScale(115),
      width: moderateScale(160),
      backgroundColor: COLORS.cardBg,
    },
    popoverContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      paddingVertical: '4%',
    },
    popoverButton: {
      ...POPOVER.button,
      justifyContent: 'space-between',
    },
  });

export default AddButton;
