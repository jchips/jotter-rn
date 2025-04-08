import { moderateScale } from '../util/scaling';
// import buttons from './buttons';
// import { useAppStyles } from '../styles';

const POPOVER = (buttons, COLORS) => {
  // const { buttons } = useAppStyles();
  return {
    popoverContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      paddingVertical: '4%',
      backgroundColor: COLORS.cardBg,
    },
    button: {
      ...buttons.btn3,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      height: moderateScale(48),
      paddingHorizontal: 10,
      marginVertical: '2%',
    }
  }
}

export default POPOVER;