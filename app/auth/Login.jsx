import {
  StyleSheet,
  Text,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import JotterText from '../../src/components/JotterText';
import LoginForm from '../../src/components/inputs/LoginForm';
import { FONT, FONTSIZE, useAppStyles } from '../../src/styles';

const Login = ({ navigation }) => {
  const { app, buttons, COLORS } = useAppStyles();
  const styles = styleSheet(app, COLORS);
  return (
    <KeyboardAvoidingView
      behavior='padding'
      style={{ ...app.container, padding: 0 }}
    >
      <View style={{ flex: 1 }} />
      <ScrollView keyboardShouldPersistTaps='handled'>
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
      </ScrollView>
    </KeyboardAvoidingView>
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

export default Login;
