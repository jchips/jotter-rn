import { StyleSheet } from 'react-native';
import { moderateScale } from '../util/scaling';
import { BORDER, FONT, FONTSIZE } from './constants';

const app = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  dashboardContainer: {
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
  },
  itemCard: {
    flex: 1,
    padding: moderateScale(15),
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: COLORS.border2,
    borderRadius: BORDER.radius,
    backgroundColor: COLORS.cardBg,
    marginVertical: 5,
  },
  input: {
    width: '100%',
    height: moderateScale(38),
    padding: 5,
    color: COLORS.text,
  },
  icon: {
    height: moderateScale(22),
    width: moderateScale(22),
  },
  icon2: {
    height: moderateScale(23),
    width: moderateScale(23),
  },
  smallText: {
    fontSize: moderateScale(FONTSIZE.xsmall),
    marginVertical: 1,
    fontFamily: FONT.regular,
    lineHeight: moderateScale(20),
  },
  boldText: {
    fontFamily: FONT.bold,
  },
  header: {
    fontSize: moderateScale(FONTSIZE.large),
    margin: 10,
    fontFamily: FONT.bold,
    color: COLORS.text
  },
  header2: {
    fontSize: moderateScale(FONTSIZE.large),
    margin: 5,
    fontFamily: FONT.bold,
    color: COLORS.text
  },
  errorAlert: {
    backgroundColor: COLORS.errAlert,
    padding: 16,
    borderRadius: 8,
    margin: 10,
    width: '100%',
  },
  errorText: {
    color: COLORS.errText,
  },
  formErrorText: {
    fontFamily: FONT.bold,
    fontSize: FONTSIZE.xsmall,
    color: COLORS.themePurpleText,
  },
  controllerContainer: {
    backgroundColor: COLORS.cardBg,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER.radius,
    padding: 5,
  },
});

export default app;
