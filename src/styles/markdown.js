import { moderateScale } from '../util/scaling';
// import COLORS from './colors';
import { BORDER, FONT, FONTSIZE } from './constants';

const MARKDOWN = (COLORS) => {
  const textColor = {
    color: COLORS.text,
  }

  return {
    heading1: {
      flexDirection: 'row',
      fontSize: moderateScale(31),
      fontFamily: FONT.bold,
      borderBottomWidth: 1,
      borderColor: '#84848424',
      paddingBottom: 10,
      marginBottom: 10,
      ...textColor,
    },
    heading2: {
      flexDirection: 'row',
      fontSize: moderateScale(23),
      fontFamily: FONT.bold,
      marginVertical: 5,
      ...textColor,
    },
    heading3: {
      flexDirection: 'row',
      fontSize: moderateScale(21),
      fontFamily: FONT.semiBold,
      marginVertical: 5,
      ...textColor,
    },
    heading4: {
      flexDirection: 'row',
      fontSize: moderateScale(17),
      fontFamily: FONT.semiBold,
      marginVertical: 5,
      ...textColor,
    },
    heading5: {
      flexDirection: 'row',
      fontSize: moderateScale(15),
      fontFamily: FONT.semiBold,
      marginVertical: 5,
      ...textColor,
    },
    heading6: {
      flexDirection: 'row',
      fontSize: moderateScale(13),
      fontFamily: FONT.semiBold,
      marginVertical: 5,
      ...textColor,
    },
    strong: {
      fontWeight: 0,
      fontFamily: FONT.bold,
      fontSize: moderateScale(FONTSIZE.regular),
      ...textColor,
    },
    em: {
      fontStyle: 'normal',
      fontFamily: FONT.italic,
      fontSize: moderateScale(FONTSIZE.regular),
      ...textColor,
    },
    bullet_list: {
      fontFamily: FONT.regular,
      lineHeight: moderateScale(21),
      fontSize: moderateScale(FONTSIZE.regular),
      ...textColor,
    },
    ordered_list: {
      fontFamily: FONT.regular,
      lineHeight: moderateScale(21),
      fontSize: moderateScale(FONTSIZE.regular),
      ...textColor,
    },

    list_item: {
      paddingRight: 20,
      fontSize: moderateScale(FONTSIZE.regular),
      ...textColor,
    },
    table: {
      borderWidth: 1,
      borderColor: COLORS.border,
      marginVertical: 20,
      maxWidth: '100%',
      overflow: 'auto'
      // borderRadius: 3,
    },
    thead: {
      fontFamily: FONT.bold,
      fontSize: moderateScale(FONTSIZE.mid),
      ...textColor,
    },
    tr: {
      borderBottomWidth: 1,
      borderColor: COLORS.border,
      flexDirection: 'row',
    },
    td: {
      flex: 1,
      padding: 5,
      fontFamily: FONT.regular,
      fontSize: moderateScale(FONTSIZE.mid),
      ...textColor,
    },
    paragraph: {
      marginTop: 10,
      marginBottom: 10,
      flexWrap: 'wrap',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      width: '100%',
      fontFamily: FONT.regular,
      lineHeight: moderateScale(21),
      fontSize: moderateScale(FONTSIZE.regular),
      ...textColor,
    },
    blockquote: {
      backgroundColor: COLORS.blockquote,
    },
    code_inline: {
      backgroundColor: COLORS.blockquote,
      color: COLORS.placeHolderText
    },
    code_block: {
      backgroundColor: COLORS.blockquote,
      ...textColor,
    },
    fence: {
      backgroundColor: COLORS.blockquote,
      ...textColor,
    },
    hr: {
      marginVertical: 20,
      marginTop: 25,
      backgroundColor: '#84848424',
    },
    link: {
      textDecorationLine: 'none', // 'underline',
      color: COLORS.themePurpleText,
    }
  }
}

export default MARKDOWN;