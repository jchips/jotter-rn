import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAppStyles } from '../styles';
import { FONT, FONTSIZE } from '../styles';

const Account = () => {
  const { user, logout } = useAuth();
  const { COLORS } = useTheme();
  const { app, buttons } = useAppStyles();
  const styles = styleSheet(app, buttons, COLORS);

  // logs user out
  const logUserOut = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>{user?.email}</Text>
      <Pressable style={styles.button} onPress={logUserOut}>
        <Text style={buttons.btnText4}>Log out</Text>
      </Pressable>
    </View>
  );
};

const styleSheet = (app, buttons, COLORS) =>
  StyleSheet.create({
    container: {
      ...app.container,
      alignItems: 'center',
      padding: 30,
    },
    h1: {
      fontFamily: FONT.bold,
      fontSize: FONTSIZE.xlarge,
      textAlign: 'center',
      marginBottom: 20,
      color: COLORS.text,
    },
    button: {
      ...buttons.btn2,
      width: '100%',
      backgroundColor: COLORS.authBtn,
    },
  });

export default Account;
