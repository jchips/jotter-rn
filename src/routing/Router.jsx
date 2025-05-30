import { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import DrawerNav from './DrawerNav';
import Login from '../auth/Login';
import ViewNote from '../components/Note/ViewNote';
import Editor from '../components/Note/Editor';
import UpdateLogin from '../auth/UpdateLogin';
import Signup from '../auth/Signup';
import { getCurrUser, removeCurrUser } from '../util/persist';
import { FONT } from '../styles';

const Stack = createStackNavigator();

const Router = () => {
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, setIsLoggedIn, setToken, setUser } = useAuth();
  const { COLORS, theme } = useTheme();
  const systemTheme = useColorScheme();

  useEffect(() => {
    const persistLogin = async () => {
      try {
        const user = await getCurrUser();
        if (user) {
          setUser(user);
          setToken(user.token);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setToken(null);
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error('Failed to fetch stored user ' + err);
        setUser(null);
        setToken(null);
        removeCurrUser();
        setIsLoggedIn(false);
        // logout()?
      }
      setLoading(false);
    };
    persistLogin();
  }, [setUser]);

  // Makes the Android navigation background color follow the device theme (dark or light)
  useEffect(() => {
    try {
      const navigationBg = async () => {
        if (theme === 'system') {
          if (systemTheme === 'light') {
            await NavigationBar.setBackgroundColorAsync(COLORS.white);
            await NavigationBar.setButtonStyleAsync('dark');
          } else {
            await NavigationBar.setBackgroundColorAsync(COLORS.darkTheme);
            await NavigationBar.setButtonStyleAsync('light');
          }
        } else {
          await NavigationBar.setBackgroundColorAsync(COLORS.background);
          await NavigationBar.setButtonStyleAsync(
            theme === 'dark' ? 'light' : 'dark'
          );
        }
        await SystemUI.setBackgroundColorAsync(COLORS.background);
      };
      Platform.OS === 'android' ? navigationBg() : null;
    } catch (err) {
      console.error(err);
    }
  }, [NavigationBar, theme, systemTheme]);

  // Sets the status bar theme
  const statusBarTheme = () => {
    if (theme === 'system') {
      return 'auto';
    } else if (theme === 'dark') {
      return 'light';
    } else {
      return 'dark';
    }
  };

  return (
    !loading && (
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar style={statusBarTheme()} />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: COLORS.background,
              },
              headerTintColor: COLORS.text2,
              animation: 'scale_from_center',
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 200 } },
                close: { animation: 'timing', config: { duration: 200 } },
              },
              cardStyleInterpolator: ({ current }) => ({
                cardStyle: { opacity: current.progress },
              }),
            }}
          >
            {isLoggedIn ? (
              <>
                <Stack.Screen
                  name='Drawer'
                  component={DrawerNav}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name='View'
                  component={ViewNote}
                  options={{
                    headerTintColor: COLORS.themePurpleText,
                    headerShadowVisible: false,
                    headerStyle: {
                      height: 90,
                      backgroundColor: COLORS.background,
                    },
                    headerTitleStyle: {
                      fontFamily: FONT.semiBold,
                    },
                  }}
                />
                <Stack.Screen
                  name='Editor'
                  component={Editor}
                  options={{
                    headerTintColor: COLORS.themePurpleText,
                    headerShadowVisible: false,
                    headerStyle: {
                      height: 90,
                      backgroundColor: COLORS.background,
                    },
                    headerTitleStyle: {
                      fontFamily: FONT.semiBold,
                    },
                  }}
                />
                <Stack.Screen
                  name='UpdateLogin'
                  component={UpdateLogin}
                  options={{
                    headerTitle: 'Update Account Info',
                    headerTintColor: COLORS.themePurpleText,
                    headerShadowVisible: false,
                    animation: 'none',
                    transitionSpec: {
                      open: { animation: 'timing', config: { duration: 200 } },
                      close: { animation: 'timing', config: { duration: 200 } },
                    },
                    cardStyleInterpolator: ({ current }) => ({
                      cardStyle: { opacity: current.progress },
                    }),
                    headerStyle: {
                      height: 90,
                      backgroundColor: COLORS.background,
                    },
                    headerTitleStyle: {
                      fontFamily: FONT.semiBold,
                    },
                  }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name='Login'
                  component={Login}
                  options={{
                    headerShadowVisible: false,
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name='Signup'
                  component={Signup}
                  options={{
                    headerShadowVisible: false,
                    headerShown: false,
                  }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    )
  );
};

const styles = StyleSheet.create({});

export default Router;
