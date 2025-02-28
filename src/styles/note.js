import { StyleSheet } from 'react-native';
import { moderateScale } from '../util/scaling';
import { FONT } from './constants';

const noteView = StyleSheet.create({
  previewContainer: {
    flex: 1,
    height: '100%',
    padding: 10,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontFamily: FONT.regular,
  },
  checkbox: {
    width: 15,
    height: 15,
    borderWidth: 1,
    lineHeight: moderateScale(21),
    borderColor: '#000',
    marginLeft: 5,
    marginRight: 10,
    fontFamily: FONT.regular,
  },
  checkedCheckbox: {
    backgroundColor: '#000',
    fontFamily: FONT.regular,
  },
  listItemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    fontFamily: FONT.regular,
    maxWidth: '100%',
  },
  bullet: {
    fontFamily: FONT.regular,
    lineHeight: moderateScale(21),
    marginLeft: 10,
    marginRight: 10,
    color: '#000',
  },
  innerBullet: {
    fontFamily: FONT.regular,
    lineHeight: moderateScale(21),
    marginLeft: 0,
    marginRight: 10,
    color: '#000',
  },
});

export default noteView;