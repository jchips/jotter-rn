
/* Code from https://medium.com/soluto-engineering/size-matters-5aeeb462900a */
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = size => width / guidelineBaseWidth * size;
const verticalScale = size => height / guidelineBaseHeight * size;
const moderateScale = (size, factor = 0.2) => size + (scale(size) - size) * factor;

export { scale, verticalScale, moderateScale };