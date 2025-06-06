import { moderateScale } from '../util/scaling';
import { BORDER, FONT, FONTSIZE } from './constants';

const buttons = (COLORS) => {
  const button = {
    alignItems: 'center',
    backgroundColor: COLORS.themePurple,
    borderRadius: BORDER.radius,
    height: moderateScale(45),
    justifyContent: 'center',
    margin: 10,
    paddingHorizontal: 20,
  };

  const buttonText = {
    color: COLORS.background,
    fontSize: moderateScale(FONTSIZE.regular),
    fontFamily: FONT.semiBold,
    lineHeight: moderateScale(20),
  };

  return {
    btn1: {
      ...button, // purple btn
    },
    btn2: {
      ...button,
      backgroundColor: COLORS.text, // opposite theme color btn
    },
    btn3: {
      ...button,
      backgroundColor: COLORS.subtle, // gray (disabled btn)
    },
    outlineBtn1: {
      ...button,
      backgroundColor: COLORS.background,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    outlineBtn2: {
      ...button,
      backgroundColor: COLORS.modalBg,
      borderWidth: 1,
      borderColor: COLORS.border,
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
      ...buttonText, // theme color text
    },
    btnText2: {
      ...buttonText,
      color: COLORS.themePurpleText, // purple text
    },
    btnText3: {
      ...buttonText,
      color: COLORS.text, // opposite theme color text
    },
    btnText4: {
      ...buttonText,
      color: COLORS.white, // white text
    }
  };
}

export default buttons;
