import axios from 'axios';
import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Keyboard,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAppStyles } from '../styles';
import { API_URL } from '@env';
import { FONT, FONTSIZE } from '../styles';
// import { app, COLORS, FONT, FONTSIZE, buttons } from '../styles';

const SignupForm = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, setIsLoggedIn } = useAuth();
  const { COLORS } = useTheme();
  const { app, buttons } = useAppStyles();
  const fieldRequired = 'This field is required';
  // app = app(COLORS);
  const styles = styleSheet(app, COLORS, buttons);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  /**
   * Creates an account for new user
   * @param {Object} formData - The form data the user submits (email and password)
   */
  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      if (formData.password !== formData.confirmPassword) {
        setLoading(false);
        return setError('Passwords do not match');
      }
      const isEmailAddr =
        /^[a-zA-z]+(\.)*(-)*(_)*[a-zA-z]*(@)[a-zA-z]+(\.)[a-zA-z]+$/gm;
      if (!isEmailAddr.test(formData.email)) {
        setLoading(false);
        return setError('Must use an email address');
      }
      const signupInfo = {
        email: formData.email,
        password: formData.password,
      };
      let requestUrl = `${API_URL}/jotter/signup`;
      let res = await axios.post(requestUrl, signupInfo);
      if (res.data.message) {
        return setError(res.data.message);
      }
      await login(signupInfo.email, signupInfo.password); // log user in
    } catch (err) {
      setIsLoggedIn(false);
      setError('Failed to sign up');
      console.error('Failed to sign up', err);
    } finally {
      reset({
        email: '',
        password: '',
        confirmPassword: '',
      });
      setLoading(false);
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorAlert}>
          <Text>{error}</Text>
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
        {errors.email && <Text style={styles.errorText}>{fieldRequired}</Text>}
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
              secureTextEntry
            />
          )}
        />
        {errors.password && (
          <Text style={styles.errorText}>{fieldRequired}</Text>
        )}
      </View>
      <View style={app.controllerContainer}>
        <Controller
          name='confirmPassword'
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='Confirm password'
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
          <Text style={styles.errorText}>{fieldRequired}</Text>
        )}
      </View>
      <Pressable
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
        disabled={loading}
      >
        <Text style={buttons.btnText4}>Sign up</Text>
      </Pressable>
    </View>
  );
};

// const styles = StyleSheet.create({
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
      backgroundColor: COLORS.logoutBtn,
    },
    errorText: {
      fontFamily: FONT.bold,
      fontSize: FONTSIZE.xsmall,
      color: COLORS.themePurpleText,
    },
  });

export default SignupForm;
