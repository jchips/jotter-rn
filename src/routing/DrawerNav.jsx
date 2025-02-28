import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useFolder } from '../hooks/useFolder.js';
import { useAuth } from '../contexts/AuthContext';
import { moderateScale } from '../util/scaling.js';
import Account from '../components/Account';
import Dashboard from '../components/Dashboard';
import Settings from '../components/Settings.jsx';
import { COLORS, FONT, FONTSIZE, BORDER, buttons } from '../styles';

const Drawer = createDrawerNavigator();

function DrawerNav({ navigation }) {
  const [currentFolder, setCurrentFolder] = useState(null);
  const { user, logout } = useAuth();
  const route = useRoute();
  const { folder } = useFolder(route?.params?.params?.folderId);

  useEffect(() => {
    if (folder?.data) {
      setCurrentFolder(folder.data);
    }
  }, [folder]);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: currentFolder ? currentFolder.title : 'Home',
      });
    }, [navigation])
  );

  // log user out
  const logUserOut = () => {
    logout();
  };

  const DrawerContent = (props) => {
    const { state, descriptors, navigation } = props;
    let currentFolderPath;
    if (currentFolder && currentFolder?.path) {
      currentFolderPath =
        typeof currentFolder.path === 'string'
          ? JSON.parse(currentFolder.path)
          : currentFolder.path;
    }
    return (
      <View style={styles.drawerContainer}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/imgs/jotter-circle.png')}
            alt='Jotter logo'
            style={styles.jotterLogo}
          />
          <Text style={styles.headerText}>Jotter</Text>
          <Text style={styles.headerEmail}>{user?.email}</Text>
        </View>
        <DrawerContentScrollView {...props}>
          {/* Home and Account items */}
          {state.routes.map((route, index) => {
            const isActive = state.index === index;
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
            );
          })}
          {currentFolder ? (
            <Text style={styles.foldersTitle}>Folders</Text>
          ) : null}

          {/* Breadcrumbs */}
          {currentFolder && currentFolderPath && currentFolderPath.length !== 0
            ? currentFolderPath.map((pathItem, index) => {
                const isActive = state.index === index + 2;
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
                );
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
          <Pressable style={buttons.outlineBtn1} onPress={logUserOut}>
            <Text style={buttons.btnText3}>Log out</Text>
          </Pressable>
        </DrawerContentScrollView>
      </View>
    );
  };

  const headerOptions = {
    headerShadowVisible: false,
    headerTitleStyle: {
      fontFamily: FONT.semiBold,
    },
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          width: moderateScale(185),
        },
        cardStyle: {
          backgroundColor: '#fff',
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
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerContainer: {
    flex: 1,
    paddingTop: 40,
  },
  jotterLogo: {
    width: moderateScale(50),
    height: moderateScale(50),
    marginBottom: 10,
  },
  header: {
    padding: 20,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  headerText: {
    fontSize: moderateScale(FONTSIZE.xlarge),
    fontFamily: FONT.bold,
  },
  headerEmail: {
    fontSize: moderateScale(FONTSIZE.xsmall),
    fontFamily: FONT.regular,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  button: {
    color: '#000',
  },
  drawerItem: {
    paddingVertical: moderateScale(10),
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  drawerLabel: {
    fontSize: moderateScale(15),
    color: '#000', // Inactive label color
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
    backgroundColor: COLORS.graySubtle,
    borderRadius: BORDER.radius,
  },
  activeLabel: {
    color: COLORS.darkTheme, // Active label (text) color
  },
});

export default DrawerNav;
