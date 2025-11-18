import { useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Keyboard,
} from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useAppStyles } from '../../styles'

const LoginForm = () => {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, setIsLoggedIn } = useAuth()
  const { COLORS } = useTheme()
  const { app, buttons } = useAppStyles()
  const styles = styleSheet(app, COLORS, buttons)
  const fieldRequired = 'This field is required'

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  /**
   * Logs user into Jotter
   * @param {Object} formData - The form data the user submits (email and password)
   */
  const onSubmit = async (formData) => {
    try {
      setLoading(true)
      setError('')
      let res = await login(formData.email, formData.password)
      if (res?.response?.data === 'Invalid login') {
        setIsLoggedIn(false)
        setError('Incorrect email or password')
      }
    } catch (err) {
      setIsLoggedIn(false)
      setError(
        error.message === 'Request failed with status code 403'
          ? 'Incorrect email or password'
          : 'Sorry, there has been a server error :('
      )
      console.error(err)
    } finally {
      reset({
        email: '',
        password: '',
      })
      setLoading(false)
      Keyboard.dismiss()
    }
  }

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorAlert}>
          <Text style={app.errorText}>{error}</Text>
        </View>
      ) : null}

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
        {errors.email && <Text style={app.formErrorText}>{fieldRequired}</Text>}
      </View>

      <View style={app.controllerContainer}>
        <Controller
          name='password'
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='Password'
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

      <Pressable
        onPress={handleSubmit(onSubmit)}
        style={{
          ...styles.button,
          backgroundColor: loading ? `${COLORS.mutedBtn}` : `${COLORS.authBtn}`,
        }}
        disabled={loading}
      >
        <Text style={buttons.btnText4}>Log in</Text>
      </Pressable>
    </View>
  )
}

const styleSheet = (app, COLORS, buttons) =>
  StyleSheet.create({
    container: {
      padding: 20,
      width: '100%',
    },
    errorAlert: {
      ...app.errorAlert,
      marginHorizontal: 0,
    },
    button: {
      ...buttons.btn2,
      marginHorizontal: 0,
    },
  })

export default LoginForm
