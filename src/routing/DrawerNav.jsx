import { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  useWindowDimensions,
} from 'react-native'
import { useSelector } from 'react-redux'
import { useRoute } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { DrawerContentScrollView } from '@react-navigation/drawer'
import { useFolder } from '../hooks/useFolder.js'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { moderateScale } from '../util/scaling.js'
import Account from '../../app/Account'
import Dashboard from '../../app/Dashboard'
import Settings from '../../app/Settings.jsx'
import { FONT, FONTSIZE, BORDER, useAppStyles } from '../styles'
import { getFolderTitle } from '../util/getFolder.js'
import api from '../util/api.js'

const Drawer = createDrawerNavigator()

function DrawerNav({ navigation }) {
  const { width: screenWidth } = useWindowDimensions()
  const [currentFolder, setCurrentFolder] = useState(null)
  const [breadcrumbPath, setBreadcrumbPath] = useState([])
  const { user, logout } = useAuth()
  const route = useRoute()
  const { folder } = useFolder(route?.params?.params?.folderId)
  const { buttons } = useAppStyles()
  const { COLORS } = useTheme()
  const recents = useSelector((state) => state.recents.data)
  const styles = styleSheet(COLORS)

  useEffect(() => {
    navigation.setOptions({
      headerTitle: folder ? folder?.title : 'Home',
    })
    if (folder?.id) {
      setCurrentFolder(folder)
      const formatPath = async () => {
        let currentFolderPath =
          typeof folder.path === 'string'
            ? JSON.parse(folder.path)
            : folder.path
        const pathWithTitles = await currentFolderPath.reduce(
          async (accPromise, item) => {
            const acc = await accPromise
            const title = await getFolderTitle(item.id)
            acc.push({ ...item, title })
            return acc
          },
          Promise.resolve([])
        )
        setBreadcrumbPath(pathWithTitles)
      }
      formatPath()
    }
  }, [folder?.id])

  // log user out
  const logUserOut = () => {
    logout()
  }

  // Custom drawer content (app icon, routes, recents, current, log out)
  const DrawerContent = (props) => {
    const { state, descriptors, navigation } = props

    return (
      <View style={styles.drawerContainer}>
        {/* App icon */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/imgs/jotter-circle.png')}
            alt='Jotter logo'
            style={styles.jotterLogo}
          />
          <Text style={styles.headerText}>Jotter</Text>
          <Text style={styles.headerEmail}>{user?.email}</Text>
        </View>

        {/* Navigation */}
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={styles.drawerWrapper}
        >
          {/* Home, Account, and Settings items */}
          {state.routes.map((route, index) => {
            const isActive = state.index === index
            return (
              <Pressable
                key={index}
                style={[styles.drawerItem, isActive && styles.activeItem]}
                onPress={() => navigation.navigate(route.name)}
              >
                <Text
                  style={[styles.drawerLabel, isActive && styles.activeLabel]}
                >
                  {descriptors[route.key].options.drawerLabel || route.name}
                </Text>
              </Pressable>
            )
          })}

          {/* Recent folders label */}
          {currentFolder ? (
            <Text style={styles.foldersTitle}>Recent folders</Text>
          ) : null}

          {/* Breadcrumbs */}
          {currentFolder && breadcrumbPath.length > 0
            ? breadcrumbPath.map((pathItem, index) => {
                const isActive = state.index === index + 2
                return (
                  <Pressable
                    key={pathItem.id}
                    style={[
                      styles.drawerItem,
                      isActive && styles.folderActiveItem,
                    ]}
                    onPress={() =>
                      navigation.navigate('Drawer', {
                        screen: 'Home',
                        params: {
                          folderId: pathItem.id,
                          folderTitle: pathItem.title,
                        },
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.drawerLabel,
                        isActive && styles.activeLabel,
                      ]}
                    >
                      {pathItem.title}
                    </Text>
                  </Pressable>
                )
              })
            : null}

          {/* current folder */}
          {currentFolder ? (
            <Pressable
              key={currentFolder.id}
              style={[styles.drawerItem, styles.folderActiveItem]}
              onPress={() =>
                navigation.navigate('Drawer', {
                  screen: 'Home',
                  params: {
                    folderId: currentFolder.id,
                    folderTitle: currentFolder.title,
                  },
                })
              }
            >
              <Text style={[styles.drawerLabel, styles.activeLabel]}>
                {currentFolder.title}
              </Text>
            </Pressable>
          ) : null}

          {/* Recent notes label */}
          {recents.length > 0 ? (
            <Text style={styles.foldersTitle}>Recent notes</Text>
          ) : null}

          {/* Recent notes (4) */}
          {recents.length > 0
            ? recents.map((note) => {
                return (
                  <Pressable
                    key={note.id}
                    style={styles.drawerItem}
                    onPress={async () => {
                      let res = await api.getNote(note.id)
                      navigation.navigate('View', {
                        note: res.data,
                      })
                    }}
                  >
                    <Text style={styles.drawerLabel}>{note.name}</Text>
                  </Pressable>
                )
              })
            : null}

          {/* Log out button */}
          <Pressable style={buttons.outlineBtn1} onPress={logUserOut}>
            <Text style={buttons.btnText3}>Log out</Text>
          </Pressable>
        </DrawerContentScrollView>
      </View>
    )
  }

  const headerOptions = {
    headerShadowVisible: false,
    headerTitleStyle: {
      fontFamily: FONT.semiBold,
    },
    headerStyle: {
      backgroundColor: COLORS.background,
    },
    headerTintColor: COLORS.text2,
  }

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          width: screenWidth < 440 ? moderateScale(184) : moderateScale(206),
        },
        cardStyle: {
          backgroundColor: COLORS.background,
        },
        ...headerOptions,
      }}
    >
      <Drawer.Screen
        name='Home'
        component={Dashboard}
        initialParams={{ folderId: null, folderTitle: 'Home' }}
      />
      <Drawer.Screen name='Account' component={Account} />
      <Drawer.Screen name='Settings' component={Settings} />
    </Drawer.Navigator>
  )
}

const styleSheet = (COLORS) =>
  StyleSheet.create({
    drawerContainer: {
      flex: 1,
      paddingTop: 40,
      backgroundColor: COLORS.background,
    },
    jotterLogo: {
      width: moderateScale(50),
      height: moderateScale(50),
      marginBottom: 10,
    },
    header: {
      padding: 20,
      backgroundColor: COLORS.faded,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: COLORS.borderDark,
    },
    headerText: {
      fontSize: moderateScale(FONTSIZE.xlarge),
      fontFamily: FONT.bold,
      color: COLORS.text,
    },
    headerEmail: {
      fontSize: moderateScale(FONTSIZE.xsmall),
      fontFamily: FONT.regular,
      color: COLORS.text,
    },
    content: {
      flex: 1,
      padding: 10,
    },
    drawerWrapper: {
      paddingTop: 20,
    },
    drawerItem: {
      paddingVertical: moderateScale(10),
      paddingHorizontal: 15,
      borderRadius: 5,
    },
    drawerLabel: {
      fontSize: moderateScale(15),
      color: COLORS.text, // Inactive label color
      fontFamily: FONT.semiBold,
    },
    activeItem: {
      backgroundColor: COLORS.themePurpleLight, // Active item background color
      borderRadius: BORDER.radius,
    },
    activeLabel: {
      color: COLORS.themePurpleText, // Active label (text) color
    },
    foldersTitle: {
      fontFamily: FONT.bold,
      fontSize: moderateScale(FONTSIZE.smaller),
      textAlign: 'center',
      marginVertical: 10,
      color: COLORS.mutedtext,
    },
    folderActiveItem: {
      backgroundColor: COLORS.subtle,
      borderRadius: BORDER.radius,
    },
    activeLabel: {
      color: COLORS.text, // Active label (text) color
    },
  })

export default DrawerNav
