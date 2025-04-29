import { StyleSheet, View, Text, Image } from 'react-native';
import { moderateScale } from '../../util/scaling';
import { useAppStyles } from '../../styles';
import { FONT, FONTSIZE, BORDER } from '../../styles';

const DropdownBtn = (selectedItem, isOpened, text, saving, width, COLORS) => {
  const { app } = useAppStyles();
  const styles = styleSheet(COLORS);
  return (
    <View
      style={{
        width: width,
        ...styles.dropdownButtonStyle,
        backgroundColor: saving ? COLORS.subtle : COLORS.cardBg,
      }}
    >
      <Text style={styles.dropdownButtonTxtStyle}>
        {(selectedItem && selectedItem.label) || text()}
      </Text>
      {!isOpened ? (
        <Image
          source={{
            uri: `https://img.icons8.com/material-outlined/100/${COLORS.themeBtnNH}/expand-arrow--v1.png`,
          }}
          alt='dropdown arrow'
          style={app.icon}
        />
      ) : (
        <Image
          source={{
            uri: `https://img.icons8.com/material-outlined/100/${COLORS.themeBtnNH}/collapse-arrow.png`,
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
    dropdownButtonStyle: {
      height: 50,
      borderWidth: 1,
      borderColor: COLORS.border2,
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
