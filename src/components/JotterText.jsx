import { StyleSheet, View, Text, Image } from 'react-native';
import { moderateScale } from '../util/scaling';
import { FONT, useAppStyles } from '../styles';

const JotterText = () => {
  const { COLORS } = useAppStyles();
  const styles = styleSheet(COLORS);
  return (
    <View style={styles.headerContainer}>
      <Image
        style={styles.img}
        source={require('../../assets/imgs/jotter-circle.png')}
        alt='Jotter logo'
      />
      <Text style={styles.header}>Jotter</Text>
    </View>
  );
};

const styleSheet = (COLORS) =>
  StyleSheet.create({
    headerContainer: {
      alignItems: 'center',
      padding: 10,
    },
    header: {
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: moderateScale(35), // 40
      fontFamily: FONT.bold,
      color: COLORS.text2,
    },
    img: {
      width: moderateScale(30), // 27
      height: moderateScale(30), // 27
      marginLeft: 3,
      marginRight: 4,
      marginTop: 4,
    },
  });

export default JotterText;
