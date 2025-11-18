import { StyleSheet, View, Text, Pressable } from 'react-native'
import { useAuth } from '../src/contexts/AuthContext'
import { useTheme } from '../src/contexts/ThemeContext'
import { FONT, FONTSIZE, useAppStyles } from '../src/styles'

const Account = ({ navigation }) => {
  const { user, logout } = useAuth()
  const { COLORS } = useTheme()
  const { app, buttons } = useAppStyles()
  const styles = styleSheet(app, buttons, COLORS)

  // logs user out
  const logUserOut = () => {
    logout()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>{user?.email}</Text>
      <Pressable
        style={styles.updateAcctBtn}
        onPress={() => navigation.navigate('UpdateLogin')}
      >
        <Text style={buttons.btnText2}>Change email or password</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={logUserOut}>
        <Text style={buttons.btnText4}>Log out</Text>
      </Pressable>
    </View>
  )
}

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
    updateAcctBtn: {
      ...buttons.outlineBtn1,
      width: '100%',
    },
  })

export default Account
