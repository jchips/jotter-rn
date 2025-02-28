import { moderateScale } from '../util/scaling';
import buttons from './buttons';

const POPOVER = {
  popoverContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    paddingVertical: '4%',
  },
  button: {
    ...buttons.btn3,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: moderateScale(48),
    paddingHorizontal: 10,
    marginVertical: '2%',
  },
}

export default POPOVER;