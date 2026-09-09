import { useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  withSpring,
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Popover from 'react-native-popover-view';
import { useTheme } from '../../contexts/ThemeContext';
import { moderateScale } from '../../util/scaling';
import { FONT, FONTSIZE, BORDER, useAppStyles } from '../../styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const FolderCard = (props) => {
  const {
    folder,
    index,
    setSelectedFolder,
    setOpenRename,
    setOpenDelete,
    setOpenMove,
    setOpenDetails,
    numColumns,
    onPress,
  } = props;
  const popoverRef = useRef();
  const { COLORS } = useTheme();
  const { app, buttons, POPOVER } = useAppStyles();
  const styles = styleSheet(app, COLORS);
  const { width: screenWidth } = useWindowDimensions();

  // grid
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
          <Image
            source={{
              uri: `https://img.icons8.com/material-outlined/100/${COLORS.textNH}/folder-invoices--v1.png`,
            }}
            alt='folder-icon'
            style={app.icon2}
          />
          <Text style={styles.h1}>{folder.title}</Text>
        </View>

        {/* Popover */}
        <Popover
          ref={popoverRef}
          from={
            <Pressable>
              <Image
                source={{
                  uri: `https://img.icons8.com/material-outlined/100/${COLORS.themeBtnNH}/more.png`,
                }}
                alt='more-icon'
                style={app.icon2}
              />
            </Pressable>
          }
          arrowSize={{ width: 0, height: 0 }}
          popoverStyle={styles.popover}
        >
          <Animated.View
            entering={FadeIn.duration(150)} // animation for popover
            style={POPOVER.popoverContainer}
          >
            {/* Rename */}
            <AnimatedPressable
              style={[renameBtnAnimatedStyle, POPOVER.button]}
              onPress={() => {
                setSelectedFolder(folder);
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
              <Text style={buttons.btnText2}>Rename folder</Text>
            </AnimatedPressable>

            {/* Details */}
            <AnimatedPressable
              style={[detailBtnAnimatedStyle, POPOVER.button]}
              onPress={() => {
                setSelectedFolder(folder);
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

            {/* Move */}
            <AnimatedPressable
              style={[moveBtnAnimatedStyle, POPOVER.button]}
              onPress={() => {
                setSelectedFolder(folder);
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
              <Text style={buttons.btnText2}>Move folder</Text>
            </AnimatedPressable>

            {/* Delete */}
            <AnimatedPressable
              style={[deleteBtnAnimatedStyle, POPOVER.button]}
              onPress={() => {
                setSelectedFolder(folder);
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
              <Text style={buttons.btnText2}>Delete folder</Text>
            </AnimatedPressable>
          </Animated.View>
        </Popover>
      </Animated.View>
    </Pressable>
  );
};

const styleSheet = (app, COLORS) =>
  StyleSheet.create({
    container: {
      ...app.itemCard,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },
    h1Container: {
      flexShrink: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    h1: {
      flexShrink: 1,
      fontSize: moderateScale(FONTSIZE.regular),
      fontFamily: FONT.bold,
      color: COLORS.themePurpleText,
      marginHorizontal: 10,
    },
    popover: {
      borderRadius: BORDER.radius,
      minHeight: moderateScale(140),
      width: moderateScale(172),
      backgroundColor: COLORS.cardBg,
    },
  });

export default FolderCard;
