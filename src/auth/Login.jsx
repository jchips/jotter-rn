import { StyleSheet, SafeAreaView, Text, Pressable } from 'react-native';
import LoginForm from './LoginForm';
import JotterText from '../components/JotterText';
import { useAppStyles } from '../styles';
import { FONT, FONTSIZE } from '../styles';
// import { app, FONT, FONTSIZE, buttons } from '../styles';

const Login = ({ navigation }) => {
  const { app, buttons, COLORS } = useAppStyles();
  const styles = styleSheet(app, COLORS);
  return (
    <SafeAreaView style={styles.container}>
      <JotterText />
      <Text style={styles.formHeader}>Log in</Text>
      <LoginForm />
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
            routes: [{ name: 'Signup' }],
          })
        }
      >
        <Text style={buttons.btnText2}>Create an account</Text>
      </Pressable>
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({
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

export default Login;
