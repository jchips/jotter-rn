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
import Constants from 'expo-constants';
import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppStyles } from '../../styles';
import demoNote from '../../util/demoNote';
import api from '../../util/api';

const API_URL = Constants.expoConfig?.extra?.API_URL;

const SignupForm = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, setIsLoggedIn } = useAuth();
  const { COLORS } = useTheme();
  const navigation = useNavigation();
  const { app, buttons } = useAppStyles();
  const styles = styleSheet(app, COLORS, buttons);
  const queryClient = useQueryClient();
  const fieldRequired = 'This field is required';
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

  const createDemoNote = async (demoNote) => {
    try {
      await api.addNote(demoNote);
    } catch (err) {
      console.error(err);
      setError('Failed to create demo note');
    }
  };

  /**
   * Creates an account for new user
   * @param {Object} formData - The signup data the user submits (email and password)
   */
  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      if (formData.password !== formData.confirmPassword) {
        setLoading(false);
        return setError('Passwords do not match');
      }

      // email address validation
      const isEmailAddr = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!isEmailAddr.test(formData.email.trim())) {
        setLoading(false);
        return setError('Must use a valid email address');
      }

      const signupInfo = {
        email: formData.email.trim(),
        password: formData.password,
      };

      // API
      let requestUrl = `${API_URL}/jotter/signup`;
      let res = await axios.post(requestUrl, signupInfo);
      if (res.data.message) {
        return setError(res.data.message);
      }
      const newUserRes = await login(signupInfo.email, signupInfo.password); // log user in
      const newUser = newUserRes?.data?.user;

      // add a markdown example (demo) note
      const mdDemoNote = {
        title: 'markdown example',
        content: demoNote,
        userId: newUser.id,
        folderId: null,
      };
      const newNote = await createDemoNote(mdDemoNote);
      queryClient.invalidateQueries({
        queryKey: ['notes', newUser?.id, null],
      });
    } catch (err) {
      // error catching
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
          <Text style={app.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* email */}
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
              keyboardType='email-address'
              textContentType='emailAddress'
              placeholderTextColor={COLORS.placeHolderText}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={app.input}
              autoComplete='email'
              autoCapitalize='none'
              autoCorrect={false}
            />
          )}
        />
        {errors.email && <Text style={app.formErrorText}>{fieldRequired}</Text>}
      </View>

      {/* new pass */}
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
              textContentType='newPassword'
              autoComplete='password-new'
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry
            />
          )}
        />
        {errors.password && (
          <Text style={app.formErrorText}>{fieldRequired}</Text>
        )}
      </View>

      {/* repeat new pass */}
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
        <Text style={buttons.btnText4}>Sign up</Text>
      </Pressable>
    </View>
  );
};

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
  });

export default SignupForm;
