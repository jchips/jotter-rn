import { StyleSheet } from 'react-native';
import COLORS from './colors';
import { moderateScale } from '../util/scaling';
import { BORDER, FONT, FONTSIZE } from './constants';

const button = {
  alignItems: 'center',
  backgroundColor: COLORS.themePurple, // change based on theme
  borderRadius: BORDER.radius,
  height: moderateScale(45),
  justifyContent: 'center',
  margin: 10,
  paddingHorizontal: 20,
};

const buttonText = {
  color: COLORS.themeWhite,
  fontSize: moderateScale(FONTSIZE.regular),
  fontFamily: FONT.semiBold,
  lineHeight: moderateScale(20),
};

const buttons = StyleSheet.create({
  btn1: {
    ...button,
  },
  btn2: {
    ...button,
    backgroundColor: COLORS.black,
  },
  btn3: {
    ...button,
    backgroundColor: COLORS.graySubtle,
  },
  outlineBtn1: {
    ...button,
    backgroundColor: COLORS.themeWhite,
    borderWidth: 1,
    borderColor: BORDER.color,
  },
  roundBtn: {
    borderRadius: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: moderateScale(58),
    height: moderateScale(58),
    backgroundColor: COLORS.themePurple,
    margin: 15,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  btnText1: {
    ...buttonText,
  },
  btnText2: {
    ...buttonText,
    color: COLORS.themePurpleText,
  },
  btnText3: {
    ...buttonText,
    color: COLORS.darkTheme,
  },
});

export default buttons;
