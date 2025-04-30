import { moderateScale } from '../util/scaling';

const POPOVER = (buttons, COLORS) => {
  return {
    popoverContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      paddingVertical: '4%',
      backgroundColor: COLORS.popover,
    },
    button: {
      ...buttons.btn3,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      height: moderateScale(48),
      paddingHorizontal: moderateScale(10),
      marginVertical: '2%',
    }
  }
}

export default POPOVER;