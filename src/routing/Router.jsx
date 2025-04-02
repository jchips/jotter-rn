import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import DrawerNav from './DrawerNav';
import Login from '../auth/Login';
import ViewNote from '../components/Note/ViewNote';
import Editor from '../components/Note/Editor';
import Signup from '../auth/Signup';
import { getCurrUser, removeCurrUser } from '../util/persist';
import { COLORS, FONT } from '../styles';

const Stack = createStackNavigator();

const Router = () => {
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, setIsLoggedIn, setToken, setUser } = useAuth();

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

  return (
    !loading && (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            animation: 'scale_from_center',
          }}
        >
          {isLoggedIn ? (
            <>
              <Stack.Screen
                name='Drawer'
                component={DrawerNav}
                options={{
                  headerShown: false,
                  animation: 'none',
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
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Router;
