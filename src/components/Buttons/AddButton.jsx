import { useRef } from 'react';
import { StyleSheet, Image, Pressable, View, Text } from 'react-native';
import Popover from 'react-native-popover-view';
import { moderateScale } from '../../util/scaling';
import { app, COLORS, BORDER, buttons } from '../../styles';

const AddButton = ({ setOpenAddTitle, setType }) => {
  const popoverRef = useRef();

  return (
    <Popover
      ref={popoverRef}
      from={
        <Pressable style={buttons.roundBtn}>
          <Image
            source={{
              uri: `https://img.icons8.com/material-outlined/100/${COLORS.whiteNoHash}/plus-math--v1.png`,
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
      <View style={styles.popoverContainer}>
        <Pressable
          style={styles.popoverButton}
          onPress={() => {
            setType('folder');
            setOpenAddTitle(true);
            popoverRef.current.requestClose();
          }}
        >
          <Image
            source={{
              uri: `https://img.icons8.com/material-outlined/100/${COLORS.textNoHash}/folder-invoices--v1.png`,
            }}
            alt='folder-icon'
            style={app.icon}
          />
          <Text style={buttons.btnText2}>New Folder</Text>
        </Pressable>
        <Pressable
          style={styles.popoverButton}
          onPress={() => {
            setType('note');
            setOpenAddTitle(true);
            popoverRef.current.requestClose();
          }}
        >
          <Image
            source={{
              uri: `https://img.icons8.com/material-outlined/100/${COLORS.textNoHash}/file.png`,
            }}
            alt='note-icon'
            style={app.icon}
          />
          <Text style={buttons.btnText2}>New Note</Text>
        </Pressable>
      </View>
    </Popover>
  );
};

const styles = StyleSheet.create({
  popover: {
    borderRadius: BORDER.radius,
    minHeight: moderateScale(115),
    width: moderateScale(160),
  },
  popoverContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    paddingVertical: '4%',
  },
  popoverButton: {
    ...buttons.btn3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: moderateScale(48),
    paddingHorizontal: moderateScale(10),
    marginVertical: '2%',
  },
});

export default AddButton;
