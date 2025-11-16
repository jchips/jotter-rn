import { useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Keyboard,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useForm, Controller } from 'react-hook-form'
import api from '../../src/util/api'
import { storeCurrUser } from '../../src/util/persist'
import { moderateScale } from '../../src/util/scaling'
import { useAuth } from '../../src/contexts/AuthContext'
import JotterText from '../../src/components/JotterText'
import { FONT, FONTSIZE, useAppStyles } from '../../src/styles'

const UpdateLogin = ({ navigation }) => {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const { user, setUser, setToken } = useAuth()
  const { app, buttons, COLORS } = useAppStyles()
  const fieldRequired = 'This field is required'
  const styles = styleSheet(app, COLORS, buttons)
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: user.email,
      newPassword: '',
      confirmPassword: '',
      password: '',
    },
  })

  /**
   * Updates the user's account information
   * @param {Object} formData - The login data the user submits
   */
  const onSubmit = async (formData) => {
    try {
      setLoading(true)
      setError('')
      if (formData.newPassword !== formData.confirmPassword) {
        setLoading(false)
        return setError('New password does not match')
      }
      let updates = {}
      if (formData.email.trim() !== user.email) {
        const isEmailAddr =
          /^[a-zA-z]+(\.)*(-)*(_)*[a-zA-z]*(@)[a-zA-z]+(\.)[a-zA-z]+$/gm
        if (!isEmailAddr.test(formData.email)) {
          setLoading(false)
          return setError('Must use a valid email address')
        }
        updates.email = formData.email.trim()
      }
      if (formData.newPassword) {
        updates.newPassword = formData.newPassword
      }
      updates.password = formData.password
      let res = await api.updateUser(updates, user.id)
      if (res.status !== 200) {
        return setError(res.data.message)
      }
      setUser(res.data)
      setToken(res.data.token)
      storeCurrUser(res.data)
      navigation.navigate('Drawer', { screen: 'Account' })
    } catch (err) {
      if (err.status === 404) {
        setError('Incorrect password')
      } else {
        setError(err.message)
      }
      console.error('Failed to update account -', err)
    } finally {
      reset({
        email: user.email,
        newPassword: '',
        confirmPassword: '',
        password: '',
      })
      setLoading(false)
      Keyboard.dismiss()
    }
  }

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.logo}>
        <JotterText />
        <Text style={styles.smallText}>
          Change account email and/or password.
        </Text>
      </View>
      {error ? (
        <View style={styles.errorAlert}>
          <Text style={app.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Email */}
      <View style={styles.inputGroup}>
        <Text style={styles.text}>Email *</Text>
        <View style={app.controllerContainer}>
          <Controller
            name='email'
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder='Email'
                placeholderTextColor={COLORS.placeHolderText}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={app.input}
                autoCapitalize='none'
                autoCorrect={false}
              />
            )}
          />
          {errors.email && (
            <Text style={app.formErrorText}>{fieldRequired}</Text>
          )}
        </View>
      </View>

      {/* Current password */}
      <View style={styles.inputGroup}>
        <Text style={styles.text}>Current password *</Text>
        <View style={app.controllerContainer}>
          <Controller
            name='password'
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder='Enter current password'
                placeholderTextColor={COLORS.placeHolderText}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={app.input}
                textContentType='password'
                autoCapitalize='none'
                autoCorrect={false}
                onSubmitEditing={handleSubmit(onSubmit)}
                secureTextEntry
              />
            )}
          />
          {errors.password && (
            <Text style={app.formErrorText}>{fieldRequired}</Text>
          )}
        </View>
      </View>

      {/* Change password button */}
      {showChangePassword ? null : (
        <Pressable
          style={styles.changePassword}
          onPress={() => setShowChangePassword(true)}
        >
          <Text style={buttons.btnText2}>Change password</Text>
        </Pressable>
      )}

      {showChangePassword ? (
        <View>
          {/* New password */}
          <View style={styles.inputGroup}>
            <Text style={styles.text}>New password</Text>
            <View style={app.controllerContainer}>
              <Controller
                name='newPassword'
                control={control}
                rules={{
                  required: false,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder='Enter new password'
                    placeholderTextColor={COLORS.placeHolderText}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={app.input}
                    textContentType='password'
                    autoCapitalize='none'
                    autoCorrect={false}
                    secureTextEntry
                  />
                )}
              />
              {errors.newPassword && (
                <Text style={app.formErrorText}>{errors.newPassword}</Text>
              )}
            </View>
          </View>

          {/* Confirm new passwword */}
          <Text style={styles.text}>Confirm new password</Text>
          <View style={app.controllerContainer}>
            <Controller
              name='confirmPassword'
              control={control}
              rules={{
                required: false,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder='Repeat new password'
                  placeholderTextColor={COLORS.placeHolderText}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={app.input}
                  textContentType='password'
                  autoCapitalize='none'
                  autoCorrect={false}
                  onSubmitEditing={handleSubmit(onSubmit)}
                  secureTextEntry
                />
              )}
            />
            {errors.confirmPassword && (
              <Text style={app.formErrorText}>{errors.confirmPassword}</Text>
            )}
          </View>
        </View>
      ) : null}

      <Pressable
        onPress={handleSubmit(onSubmit)}
        style={{
          ...styles.button,
          backgroundColor: loading ? `${COLORS.mutedBtn}` : `${COLORS.authBtn}`,
        }}
        disabled={loading}
      >
        <Text style={buttons.btnText4}>Update account</Text>
      </Pressable>
    </KeyboardAwareScrollView>
  )
}

const styleSheet = (app, COLORS, buttons) =>
  StyleSheet.create({
    container: {
      ...app.container,
      padding: 30,
    },
    smallText: {
      ...app.smallText,
      color: COLORS.themePurpleText,
      fontSize: FONTSIZE.small,
      fontFamily: FONT.semiBold,
      textAlign: 'center',
    },
    logo: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    text: {
      fontSize: FONTSIZE.regular,
      fontFamily: FONT.bold,
      color: COLORS.themePurpleLabel,
    },
    inputGroup: {
      marginBottom: moderateScale(5),
    },
    errorAlert: {
      ...app.errorAlert,
      marginHorizontal: 0,
    },
    button: {
      ...buttons.btn2,
      marginHorizontal: 0,
      marginBottom: moderateScale(50), // keyboard
    },
    changePassword: {
      ...buttons.outlineBtn1,
      width: '100%',
      marginHorizontal: 0,
    },
  })

export default UpdateLogin
