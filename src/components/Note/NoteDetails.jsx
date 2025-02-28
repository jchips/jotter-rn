import React from 'react';
import { Modal, StyleSheet, Text, View, Pressable } from 'react-native';
import getWordCount from '../../util/getWordCount';
import formatDate from '../../util/formatDate';
import { moderateScale } from '../../util/scaling';
import { app, COLORS, FONT, FONTSIZE, MODAL, buttons } from '../../styles';

const NoteDetails = ({ openDetails, setOpenDetails, note }) => {
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
            {note?.title}{' '}
            <Text style={{ fontSize: FONTSIZE.regular }}>details</Text>
          </Text>
          <View style={styles.modalBody}>
            <Text style={styles.modalText}>
              <Text style={app.boldText}>Date created:</Text>{' '}
              {formatDate(note?.createdAt)}
            </Text>
            <Text style={styles.modalText}>
              <Text style={app.boldText}>Last edited:</Text>{' '}
              {formatDate(note?.updatedAt)}
            </Text>
            <Text style={styles.modalText}>
              <Text style={app.boldText}>Word count:</Text>{' '}
              {getWordCount(note?.content)}
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

const styles = StyleSheet.create({
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

export default NoteDetails;
