import { StyleSheet, SafeAreaView, Text, Pressable } from 'react-native';
import JotterText from '../components/JotterText';
import SignupForm from './SignupForm';
import { useAppStyles } from '../styles';
import { FONT, FONTSIZE } from '../styles';

const Signup = ({ navigation }) => {
  const { app, buttons, COLORS } = useAppStyles();
  const styles = styleSheet(app, COLORS);
  return (
    <SafeAreaView style={styles.container}>
      <JotterText />
      <Text style={styles.formHeader}>Sign up</Text>
      <SignupForm />
      <Text
        style={{
          fontFamily: FONT.bold,
          fontSize: FONTSIZE.regular,
          marginBottom: 10,
          color: COLORS.text,
        }}
      >
        or
      </Text>
      <Pressable
        style={buttons.outlineBtn1}
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        }
      >
        <Text style={buttons.btnText2}>Log in to account</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styleSheet = (app, COLORS) =>
  StyleSheet.create({
    container: {
      ...app.container,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    formHeader: {
      fontSize: FONTSIZE.large,
      fontFamily: FONT.bold,
      color: COLORS.text,
    },
  });

export default Signup;
