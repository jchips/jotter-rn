import { useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import Popover from 'react-native-popover-view';
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

const FolderCard = (props) => {
  const {
    folder,
    setSelectedFolder,
    setOpenRename,
    setOpenDelete,
    setOpenMove,
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
        <Image
          source={{
            uri: `https://img.icons8.com/material-outlined/100/${COLORS.textNoHash}/folder-invoices--v1.png`,
          }}
          alt='folder-icon'
          style={app.icon2}
        />
        <Text style={styles.h1}>{folder.title}</Text>
      </View>
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
              setSelectedFolder(folder);
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
            <Text style={buttons.btnText2}>Rename folder</Text>
          </Pressable>
          <Pressable
            style={POPOVER.button}
            onPress={() => {
              setSelectedFolder(folder);
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
            <Text style={buttons.btnText2}>Move folder</Text>
          </Pressable>
          <Pressable
            style={POPOVER.button}
            onPress={() => {
              setSelectedFolder(folder);
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
            <Text style={buttons.btnText2}>Delete folder</Text>
          </Pressable>
        </View>
      </Popover>
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
});

export default FolderCard;
