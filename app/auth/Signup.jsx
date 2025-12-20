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
import SignupForm from '../../src/components/inputs/SignupForm';
import { FONT, FONTSIZE, useAppStyles } from '../../src/styles';

const Signup = ({ navigation }) => {
  const { app, buttons, COLORS } = useAppStyles();
  const styles = styleSheet(app, COLORS);
  return (
    <KeyboardAvoidingView
      behavior='padding'
      style={{
        ...app.container,
        padding: 0,
      }}
    >
      <View style={{ flex: 1 }} />
      <ScrollView>
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

export default Signup;
