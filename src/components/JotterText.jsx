import { StyleSheet, View, Text, Image } from 'react-native';
import { moderateScale } from '../util/scaling';
import { useAppStyles } from '../styles';
import { FONT } from '../styles';

const JotterText = () => {
  const { COLORS } = useAppStyles();
  const styles = styleSheet(COLORS);
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.header}>J</Text>
      <Image
        style={styles.img}
        source={require('../../assets/imgs/jotter-circle.png')}
        alt='Jotter logo'
      />
      <Text style={styles.header}>tter</Text>
    </View>
  );
};

// const styles = StyleSheet.create({
const styleSheet = (COLORS) =>
  StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    },
    header: {
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: moderateScale(40),
      fontFamily: FONT.bold,
      color: COLORS.text,
    },
    img: {
      width: moderateScale(27),
      height: moderateScale(27),
      marginLeft: 3,
      marginRight: 4,
      marginTop: 4,
    },
  });

export default JotterText;
