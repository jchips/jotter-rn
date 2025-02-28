import { useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import Popover from 'react-native-popover-view';
import formatDate from '../../util/formatDate';
import { moderateScale } from '../../util/scaling';
import {
  app,
  COLORS,
  FONT,
  FONTSIZE,
  BORDER,
  POPOVER,
  buttons,
} from '../../styles';

const screenWidth = Dimensions.get('window').width;

const NoteCard = (props) => {
  const {
    note,
    setSelectedNote,
    setOpenRename,
    setOpenMove,
    setOpenDelete,
    setOpenDetails,
    numColumns,
  } = props;
  const popoverRef = useRef();
  const itemWidth =
    (screenWidth -
      app.dashboardContainer.paddingHorizontal * (numColumns + 1)) /
    numColumns;

  return (
    <View style={[styles.container, { width: itemWidth }]}>
      <View style={styles.h1Container}>
        <Text style={styles.h1}>{note.title}</Text>
        <Popover
          ref={popoverRef}
          from={
            <Pressable>
              <Image
                source={{
                  uri: `https://img.icons8.com/material-outlined/100/more.png`,
                }}
                alt='more-icon'
                style={app.icon2}
              />
            </Pressable>
          }
          arrowSize={{ width: 0, height: 0 }}
          popoverStyle={styles.popover}
        >
          <View style={POPOVER.popoverContainer}>
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
                  uri: `https://img.icons8.com/material-outlined/100/${COLORS.textNoHash}/rename.png`,
                }}
                alt='rename-icon'
                style={app.icon2}
              />
              <Text style={buttons.btnText2}>Rename note</Text>
            </Pressable>
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
                  uri: `https://img.icons8.com/material-outlined/100/${COLORS.textNoHash}/info--v1.png`,
                }}
                alt='details-icon'
                style={app.icon2}
              />
              <Text style={buttons.btnText2}>View details</Text>
            </Pressable>
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
                  uri: `https://img.icons8.com/material-outlined/100/${COLORS.textNoHash}/reorder.png`,
                }}
                alt='move-icon'
                style={app.icon2}
              />
              <Text style={buttons.btnText2}>Move note</Text>
            </Pressable>
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
                  uri: `https://img.icons8.com/material-outlined/100/${COLORS.textNoHash}/trash--v1.png`,
                }}
                alt='delete-icon'
                style={app.icon2}
              />
              <Text style={buttons.btnText2}>Delete note</Text>
            </Pressable>
          </View>
        </Popover>
      </View>
      <View>
        <Text style={styles.metaData}>{formatDate(note.createdAt)}</Text>
        <Text style={styles.metaData}>{formatDate(note.updatedAt)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
});

export default NoteCard;
