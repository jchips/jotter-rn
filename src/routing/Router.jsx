import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import DrawerNav from './DrawerNav';
import Login from '../auth/Login';
import ViewNote from '../components/Note/ViewNote';
import Editor from '../components/Note/Editor';
import Signup from '../auth/Signup';
import { getCurrUser, removeCurrUser } from '../util/persist';
import { FONT } from '../styles';
// import { COLORS, FONT } from '../styles';

const Stack = createStackNavigator();

const Router = () => {
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, setIsLoggedIn, setToken, setUser } = useAuth();
  const { COLORS, theme } = useTheme();

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
  }, []);

  // const MyTheme = {
  //   ...DefaultTheme,
  //   dark: true,
  //   colors: {
  //     ...DefaultTheme.colors,
  //     background: COLORS.background,
  //     primary: COLORS.text,
  //   },
  // };

  return (
    !loading && (
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: COLORS.background,
              },
              headerTintColor: COLORS.text2,
              // headerTintColor: COLORS.text,
              // animation: 'none',
              animation: 'scale_from_center',
              // animation: theme === 'light' ? 'scale_from_center' : 'none',
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
                    // animation: 'none',
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
