import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useFolder } from '../../hooks/useFolder';
import { useAppStyles } from '../../styles';
import getWordCount from '../../util/getWordCount';
import formatDate from '../../util/formatDate';
import { moderateScale } from '../../util/scaling';
import { FONT, FONTSIZE } from '../../styles';

const Details = ({ openDetails, setOpenDetails, note, folder }) => {
  const { childNotes, childFolders } = useFolder(folder?.id);
  const { COLORS } = useTheme();
  const { app, MODAL, buttons } = useAppStyles();
  const styles = styleSheet(COLORS, MODAL);

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={openDetails}
      onRequestClose={() => {
        setOpenDetails(!openDetails);
      }}
    >
      <View style={MODAL.centeredView}>
        <View style={styles.modal}>
          <Text style={app.header}>
            {note?.title || folder?.title}{' '}
            <Text style={{ fontSize: FONTSIZE.regular }}>details</Text>
          </Text>
          <View style={styles.modalBody}>
            <Text style={styles.modalText}>
              <Text style={app.boldText}>Date created:</Text>{' '}
              {formatDate(note?.createdAt || folder?.createdAt)}
            </Text>
            <Text style={styles.modalText}>
              <Text style={app.boldText}>Last edited:</Text>{' '}
              {formatDate(note?.updatedAt || folder?.updatedAt)}
            </Text>
            {folder ? (
              <Text style={styles.modalText}>
                <Text style={app.boldText}>Folder count:</Text>{' '}
                {childFolders ? (
                  childFolders?.length
                ) : (
                  <ActivityIndicator
                    size={moderateScale(15)}
                    color={COLORS.themePurple}
                  />
                )}
              </Text>
            ) : null}
            <Text style={styles.modalText}>
              {note ? (
                <>
                  <Text style={app.boldText}>Word count:</Text>{' '}
                  {getWordCount(note?.content)}
                </>
              ) : null}
              {folder ? (
                <Text>
                  <Text style={app.boldText}>Note count:</Text>{' '}
                  {childNotes ? (
                    childNotes?.length
                  ) : (
                    <ActivityIndicator
                      size={moderateScale(15)}
                      color={COLORS.themePurple}
                    />
                  )}
                </Text>
              ) : null}
            </Text>
          </View>
          <Pressable
            style={[buttons.btn1, styles.button]}
            onPress={() => {
              setOpenDetails(!openDetails);
            }}
          >
            <Text style={buttons.btnText1}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styleSheet = (COLORS, MODAL) =>
  StyleSheet.create({
    button: {
      width: '90%',
      marginTop: 20,
    },
    modal: {
      ...MODAL.modal,
      width: '85%',
    },
    modalBody: {
      textAlign: 'left',
      width: '85%',
    },
    modalText: {
      fontFamily: FONT.regular,
      fontSize: moderateScale(FONTSIZE.regular),
      color: COLORS.themePurpleText,
      lineHeight: moderateScale(25),
    },
  });

export default Details;
