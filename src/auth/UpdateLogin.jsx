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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { storeCurrUser } from '../util/persist';
import api from '../util/api';
import showToast from '../util/showToast';
import { useAuth } from '../contexts/AuthContext';
import JotterText from '../components/JotterText';
import { useAppStyles } from '../styles';
import { FONT, FONTSIZE } from '../styles';

const UpdateLogin = ({ navigation }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, setUser, setToken } = useAuth();
  const { app, buttons, COLORS } = useAppStyles();
  const fieldRequired = 'This field is required';
  const styles = styleSheet(app, COLORS, buttons);
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
  });

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      if (formData.newPassword !== formData.confirmPassword) {
        setLoading(false);
        return setError('Passwords do not match');
      }
      let updates = {};
      if (formData.email.trim() !== user.email) {
        const isEmailAddr =
          /^[a-zA-z]+(\.)*(-)*(_)*[a-zA-z]*(@)[a-zA-z]+(\.)[a-zA-z]+$/gm;
        if (!isEmailAddr.test(formData.email)) {
          setLoading(false);
          return setError('Must use an email address');
        }
        updates.email = formData.email.trim();
      }
      if (formData.newPassword) {
        updates.newPassword = formData.newPassword;
      }
      updates.password = formData.password;
      let res = await api.updateUser(updates, user.id);
      // console.log('res:', res.data); // dl
      // if (res.status === 404) {
      //   return setError()
      // }
      if (res.status !== 200) {
        return setError(res.data.message);
      }
      setUser(res.data);
      setToken(res.data.token);
      storeCurrUser(res.data);
      showToast(`Successfully updated account info`);
      navigation.navigate('Drawer', { screen: 'Account' });
    } catch (err) {
      if (err.status === 404) {
        setError('Incorrect password');
      } else {
        setError(err.message);
      }
      console.error('Failed to update account -', err);
    } finally {
      reset({
        email: user.email,
        newPassword: '',
        confirmPassword: '',
        password: '',
      });
      setLoading(false);
      Keyboard.dismiss();
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.logo}>
        <JotterText />
        <Text style={styles.smallText}>
          Leave password fields blank to keep unchanged.
        </Text>
      </View>
      {error ? (
        <View style={styles.errorAlert}>
          <Text>{error}</Text>
        </View>
      ) : null}

      <Text style={styles.text}>Email</Text>
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
              placeholder='Enter password'
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
          <Text style={styles.errorText}>{errors.newPassword}</Text>
        )}
      </View>

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
              placeholder='Re-enter new password'
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
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        )}
      </View>

      <Text style={styles.text}>Current password*</Text>
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
          <Text style={styles.errorText}>{fieldRequired}</Text>
        )}
      </View>
      <Pressable
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
        disabled={loading}
      >
        <Text style={buttons.btnText4}>Update account</Text>
      </Pressable>
    </KeyboardAwareScrollView>
  );
};

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
      color: COLORS.text,
    },
    errorAlert: {
      ...app.errorAlert,
      marginHorizontal: 0,
    },
    button: {
      ...buttons.btn2,
      marginHorizontal: 0,
      backgroundColor: COLORS.authBtn,
      marginBottom: 50, // keyboard
    },
    errorText: {
      fontFamily: FONT.bold,
      fontSize: FONTSIZE.xsmall,
      color: COLORS.themePurpleText,
    },
  });

export default UpdateLogin;
