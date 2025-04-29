import { moderateScale } from '../util/scaling';
import { BORDER, FONT, FONTSIZE } from './constants';

const MODAL = (COLORS, app) => {
  return {
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modal: {
      margin: 20,
      width: '90%',
      backgroundColor: COLORS.modalBg,
      borderRadius: BORDER.radius,
      padding: moderateScale(10),
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
    controllerContainer: {
      ...app.controllerContainer,
      width: '90%',
    },
    dropdownMenuStyle: {
      backgroundColor: COLORS.background,
      borderRadius: BORDER.radius,
    },
    dropdownItemStyle: {
      width: '100%',
      flexDirection: 'row',
      paddingHorizontal: 12,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 15,
    },
    dropdownItemTxtStyle: {
      flex: 1,
      fontFamily: FONT.semiBold,
      fontSize: moderateScale(FONTSIZE.regular),
      color: COLORS.text,
    },
    buttons: {
      alignItems: 'center',
      flexDirection: 'row',
      margin: 5,
    },
    button: {
      flex: 1,
      marginHorizontal: 5,
    },
    wideButton: {
      width: '90%',
      marginTop: 20,
    }
  }
}

export default MODAL;