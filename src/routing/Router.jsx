/* Folding level 5 (VS Code, cmd/ctrl + k + 5) */
import { useEffect, useState } from 'react'
import {
  StyleSheet,
  StatusBar as RNStatusBar,
  View,
  Platform,
  useColorScheme,
} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import * as NavigationBar from 'expo-navigation-bar'
import { StatusBar } from 'expo-status-bar'
import * as SystemUI from 'expo-system-ui'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import DrawerNav from './DrawerNav'
import Login from '../../app/auth/Login'
import ViewNote from '../../app/ViewNote'
import Editor from '../../app/Editor'
import UpdateLogin from '../../app/auth/UpdateLogin'
import Signup from '../../app/auth/Signup'
import { getCurrUser, removeCurrUser } from '../util/persist'
import { useRecentStore } from '../recentStore'
import { FONT } from '../styles'

const Stack = createStackNavigator()

const Router = () => {
  const [loading, setLoading] = useState(true)
  const [lastNoteId, setLastNoteId] = useState(null)
  const { isLoggedIn, setIsLoggedIn, setToken, setUser, user } = useAuth()
  const { COLORS, theme } = useTheme()
  const systemTheme = useColorScheme()
  const addRecent = useRecentStore((state) => state.addRecent)

  useEffect(() => {
    const persistLogin = async () => {
      try {
        const activeUser = await getCurrUser()
        if (activeUser) {
          setUser(activeUser)
          setToken(activeUser.token)
          setIsLoggedIn(true)
        } else {
          setUser(null)
          setToken(null)
          setIsLoggedIn(false)
        }
      } catch (err) {
        console.error('Failed to fetch active user ' + err)
        setUser(null)
        setToken(null)
        removeCurrUser()
        setIsLoggedIn(false)
        // logout()?
      }
      setLoading(false)
    }
    persistLogin()
  }, [setUser])

  useEffect(() => {
    useRecentStore.getState().loadRecent(user?.id)
  }, [user?.id])

  // Makes the Android navigation background color follow the device theme (dark or light)
  useEffect(() => {
    try {
      const navigationBg = async () => {
        if (theme === 'system') {
          if (systemTheme === 'light') {
            await NavigationBar.setButtonStyleAsync('dark')
          } else {
            await NavigationBar.setButtonStyleAsync('light')
          }
        } else {
          await NavigationBar.setButtonStyleAsync(
            theme === 'dark' ? 'light' : 'dark'
          )
        }
        await SystemUI.setBackgroundColorAsync(COLORS.background)
      }
      Platform.OS === 'android' ? navigationBg() : null
    } catch (err) {
      console.error(err)
    }
  }, [NavigationBar, theme, systemTheme])

  // Sets the status bar text theme
  const statusBarTextStyle =
    theme === 'system'
      ? systemTheme === 'light'
        ? 'dark'
        : 'light'
      : theme === 'dark'
      ? 'light'
      : 'dark'

  return (
    !loading && (
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        {Platform.OS === 'android' && Platform.Version <= 33 ? (
          <>
            <RNStatusBar hidden />
            <StatusBar hidden />
          </>
        ) : (
          <StatusBar style={statusBarTextStyle} />
        )}
        <NavigationContainer
          onStateChange={(state) => {
            const route = getActiveRoute(state)

            // Store recent notes
            if (route?.params && route.name === 'View') {
              const note = route.params

              // prevent repeated updates
              if (note.noteId !== lastNoteId) {
                setLastNoteId(note.noteId)
                addRecent({
                  id: note.noteId,
                  userId: user?.id,
                  folderId: note.noteFolder,
                })
              }
            }
          }}
        >
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
  )
}

/**
 * Gets the active (current) route.
 * @param {Object} state - current route
 * @returns {Object} - active route
 */
const getActiveRoute = (state) => {
  let current = state
  while (current?.routes && current.index != null) {
    current = current.routes[current.index]
  }
  return current
}

const styles = StyleSheet.create({})

export default Router
