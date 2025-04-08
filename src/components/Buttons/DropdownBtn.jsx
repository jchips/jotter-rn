import { StyleSheet, View, Text, Image } from 'react-native';
import { moderateScale } from '../../util/scaling';
// import { useTheme } from '../../contexts/ThemeContext';
import { useAppStyles } from '../../styles';
import { FONT, FONTSIZE, BORDER } from '../../styles';
// import { app, COLORS, FONT, FONTSIZE, BORDER } from '../../styles';

const DropdownBtn = (selectedItem, isOpened, text, saving, width, COLORS) => {
  // const { COLORS } = useTheme();
  const { app } = useAppStyles();
  const styles = styleSheet(COLORS);
  return (
    <View
      style={{
        width: width,
        ...styles.dropdownButtonStyle,
        backgroundColor: saving ? COLORS.graySubtle : COLORS.cardBg,
      }}
    >
      <Text style={styles.dropdownButtonTxtStyle}>
        {(selectedItem && selectedItem.label) || text()}
      </Text>
      {!isOpened ? (
        <Image
          source={{
            uri: `https://img.icons8.com/material-outlined/100/${COLORS.themeNoHash}/expand-arrow--v1.png`,
          }}
          alt='dropdown arrow'
          style={app.icon}
        />
      ) : (
        <Image
          source={{
            uri: `https://img.icons8.com/material-outlined/100/${COLORS.themeNoHash}/collapse-arrow.png`,
          }}
          alt='dropdown arrow'
          style={app.icon}
        />
      )}
    </View>
  );
};

const styleSheet = (COLORS) =>
  StyleSheet.create({
    // const styles = StyleSheet.create({
    dropdownButtonStyle: {
      // width: '95%',
      height: 50,
      borderWidth: 1,
      borderColor: COLORS.border,
      // borderColor: BORDER.color,
      borderRadius: BORDER.radius,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 12,
      paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
      flex: 1,
      fontFamily: FONT.regular,
      fontSize: moderateScale(FONTSIZE.mid),
      color: COLORS.text,
    },
  });

export default DropdownBtn;
