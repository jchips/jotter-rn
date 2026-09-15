import { useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  useWindowDimensions,
} from 'react-native';
import Popover from 'react-native-popover-view';
import Animated, {
  withSpring,
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import formatDate from '../../util/formatDate';
import { moderateScale } from '../../util/scaling';
import { useAppStyles } from '../../styles';
import { FONT, FONTSIZE, BORDER } from '../../styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const NoteCard = (props) => {
  const {
    note,
    index,
    setSelectedNote,
    setOpenRename,
    setOpenMove,
    setOpenDelete,
    setOpenDetails,
    numColumns,
    onPress,
  } = props;
  const popoverRef = useRef();
  const { app, POPOVER, buttons } = useAppStyles();
  const { COLORS } = useTheme();
  const styles = styleSheet(app, COLORS);

  // grid
  const { width: screenWidth } = useWindowDimensions();
  const itemWidth =
    (screenWidth -
      app.dashboardContainer.paddingHorizontal * (numColumns + 1)) /
    numColumns;

  // animations
  const cardScale = useSharedValue(1);
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));
  const renameBtnScale = useSharedValue(1);
  const renameBtnAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: renameBtnScale.value }],
  }));
  const detailBtnScale = useSharedValue(1);
  const detailBtnAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: detailBtnScale.value }],
  }));
  const moveBtnScale = useSharedValue(1);
  const moveBtnAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: moveBtnScale.value }],
  }));
  const deleteBtnScale = useSharedValue(1);
  const deleteBtnAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: deleteBtnScale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        cardScale.value = withSpring(0.97); // animation for card press
      }}
      onPressOut={() => {
        cardScale.value = withSpring(1);
      }}
    >
      <Animated.View
        entering={FadeInDown.delay(index * 40).duration(250)}
        style={[cardAnimatedStyle, styles.container, { width: itemWidth }]}
      >
        <View style={styles.h1Container}>
          <View>
            <Text style={styles.h1}>{note.title}</Text>
          </View>
          {/* Note options Popover */}
          <Popover
            ref={popoverRef}
            from={
              <Pressable>
                <Image
                  source={{
                    uri: `https://img.icons8.com/material-outlined/100/${COLORS.noteBtnNH}/more.png`,
                  }}
                  alt='more-icon'
                  style={app.icon2}
                />
              </Pressable>
            }
            arrowSize={{ width: 0, height: 0 }}
            popoverStyle={styles.popover}
          >
            <Animated.View style={POPOVER.popoverContainer}>
              {/* Rename note */}
              <AnimatedPressable
                style={[renameBtnAnimatedStyle, POPOVER.button]}
                onPress={() => {
                  setSelectedNote(note);
                  setOpenRename(true);
                  popoverRef.current.requestClose();
                }}
                onPressIn={() => {
                  renameBtnScale.value = withSpring(0.97);
                }}
                onPressOut={() => {
                  renameBtnScale.value = withSpring(1);
                }}
              >
                <Image
                  source={{
                    uri: `https://img.icons8.com/material-outlined/100/${COLORS.textNH}/rename.png`,
                  }}
                  alt='rename-icon'
                  style={app.icon2}
                />
                <Text style={buttons.btnText2}>Rename note</Text>
              </AnimatedPressable>
              {/* Open note details */}
              <AnimatedPressable
                style={[detailBtnAnimatedStyle, POPOVER.button]}
                onPress={() => {
                  setSelectedNote(note);
                  setOpenDetails(true);
                  popoverRef.current.requestClose();
                }}
                onPressIn={() => {
                  detailBtnScale.value = withSpring(0.97);
                }}
                onPressOut={() => {
                  detailBtnScale.value = withSpring(1);
                }}
              >
                <Image
                  source={{
                    uri: `https://img.icons8.com/material-outlined/100/${COLORS.textNH}/info--v1.png`,
                  }}
                  alt='details-icon'
                  style={app.icon2}
                />
                <Text style={buttons.btnText2}>View details</Text>
              </AnimatedPressable>
              {/* Move note */}
              <AnimatedPressable
                style={[moveBtnAnimatedStyle, POPOVER.button]}
                onPress={() => {
                  setSelectedNote(note);
                  setOpenMove(true);
                  popoverRef.current.requestClose();
                }}
                onPressIn={() => {
                  moveBtnScale.value = withSpring(0.97);
                }}
                onPressOut={() => {
                  moveBtnScale.value = withSpring(1);
                }}
              >
                <Image
                  source={{
                    uri: `https://img.icons8.com/material-outlined/100/${COLORS.textNH}/reorder.png`,
                  }}
                  alt='move-icon'
                  style={app.icon2}
                />
                <Text style={buttons.btnText2}>Move note</Text>
              </AnimatedPressable>
              {/* Delete note */}
              <AnimatedPressable
                style={[deleteBtnAnimatedStyle, POPOVER.button]}
                onPress={() => {
                  setSelectedNote(note);
                  setOpenDelete(true);
                  popoverRef.current.requestClose();
                }}
                onPressIn={() => {
                  deleteBtnScale.value = withSpring(0.97);
                }}
                onPressOut={() => {
                  deleteBtnScale.value = withSpring(1);
                }}
              >
                <Image
                  source={{
                    uri: `https://img.icons8.com/material-outlined/100/${COLORS.textNH}/trash--v1.png`,
                  }}
                  alt='delete-icon'
                  style={app.icon2}
                />
                <Text style={buttons.btnText2}>Delete note</Text>
              </AnimatedPressable>
            </Animated.View>
          </Popover>
        </View>
        <View>
          <Text style={styles.metaData}>{formatDate(note.createdAt)}</Text>
          <Text style={styles.metaData}>{formatDate(note.updatedAt)}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styleSheet = (app, COLORS) =>
  StyleSheet.create({
    container: {
      ...app.itemCard,
    },
    h1Container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 1,
      flexWrap: 'wrap',
      marginBottom: 10,
    },
    h1: {
      fontSize: moderateScale(FONTSIZE.regular),
      fontFamily: FONT.bold,
      color: COLORS.text,
    },
    metaData: {
      fontSize: moderateScale(FONTSIZE.smaller),
      fontFamily: FONT.regular,
      color: COLORS.mutedtext,
    },
    popover: {
      borderRadius: BORDER.radius,
      minHeight: moderateScale(190),
      width: moderateScale(170),
      backgroundColor: COLORS.cardBg,
    },
  });

export default NoteCard;
