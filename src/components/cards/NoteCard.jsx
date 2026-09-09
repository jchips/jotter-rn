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
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.97);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
    >
      <Animated.View
        entering={FadeInDown.delay(index * 40).duration(250)}
        style={[animatedStyle, styles.container, { width: itemWidth }]}
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
            <Animated.View
              entering={FadeIn.duration(150)}
              style={POPOVER.popoverContainer}
            >
              {/* Rename note */}
              <Pressable
                style={POPOVER.button}
                onPress={() => {
                  setSelectedNote(note);
                  setOpenRename(true);
                  popoverRef.current.requestClose();
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
              </Pressable>

              {/* Open note details */}
              <Pressable
                style={POPOVER.button}
                onPress={() => {
                  setSelectedNote(note);
                  setOpenDetails(true);
                  popoverRef.current.requestClose();
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
              </Pressable>

              {/* Move note */}
              <Pressable
                style={POPOVER.button}
                onPress={() => {
                  setSelectedNote(note);
                  setOpenMove(true);
                  popoverRef.current.requestClose();
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
              </Pressable>

              {/* Delete note */}
              <Pressable
                style={POPOVER.button}
                onPress={() => {
                  setSelectedNote(note);
                  setOpenDelete(true);
                  popoverRef.current.requestClose();
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
              </Pressable>
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
