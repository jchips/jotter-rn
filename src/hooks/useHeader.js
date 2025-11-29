/* Folding level 4 (VS Code, cmd/ctrl + k + 4) */
import { Pressable, View, Image } from 'react-native';
import { useAppStyles } from '../styles';
import { queryClient } from '../contexts/AuthContext';

export function useHeader() {
  const { app, buttons, COLORS } = useAppStyles();

  const headers = {
    dashboard: (props) => {
      const {
        setOpenGrid,
        setOpenSort,
        folderParent,
        folder_id,
        configSettings,
        navigation,
        userId,
        path
      } = props;
      return (
        <View style={{ flexDirection: 'row' }}>
          {/* Navigate folder up */}
          {folder_id && (
            <Pressable
              onPress={() => {
                let cachedFolder = findItemInCache(folderParent, userId, path)
                return navigation.navigate('Drawer', {
                  screen: 'Home',
                  params: {
                    folderId: folderParent,
                    folderTitle: cachedFolder?.title || 'Home',
                    folderParent: cachedFolder?.parentId || null,
                  },
                })
              }}
              style={styles.headerButton}
            >
              <Image
                source={{
                  uri: `https://img.icons8.com/material-outlined/100/${COLORS.themeBtnNH}/up.png`,
                }}
                alt='folder-up-button'
                style={app.icon}
              />
            </Pressable>
          )}

          {/* Grid */}
          <Pressable
            onPress={() => {
              setOpenGrid(true)
            }}
            style={styles.headerButton}
          >
            <Image
              source={{
                uri:
                  configSettings?.gridSize === '2'
                    ? `https://img.icons8.com/material-outlined/100/${COLORS.themeBtnNH}/rows.png`
                    : `https://img.icons8.com/material-outlined/100/${COLORS.themeBtnNH}/grid-2.png`,
              }}
              alt='grid-button'
              style={app.icon}
            />
          </Pressable>

          {/* Sort */}
          <Pressable
            onPress={() => {
              setOpenSort(true)
            }}
            style={styles.headerButton}
          >
            <Image
              source={{
                uri: `https://img.icons8.com/material-outlined/100/${COLORS.themeBtnNH}/sorting-arrows.png`,
              }}
              alt='sort-button'
              style={app.icon}
            />
          </Pressable>
        </View>
      )
    },
    note: (props) => {
      const {
        noteId,
        folderId,
        navigation,
        userId
      } = props;
      return (
        <View style={{ flexDirection: 'row' }}>
          {/* Navigate folder up */}
          {noteId && (
            <Pressable
              onPress={() => {
                let cachedFolder = findItemInCache(folderId, userId)
                return navigation.navigate('Drawer', {
                  screen: 'Home',
                  params: {
                    folderId: folderId,
                    folderTitle: cachedFolder?.title || 'Home',
                    folderParent: cachedFolder?.parentId || null,
                  },
                })
              }}
              style={styles.headerButton}
            >
              <Image
                source={{
                  uri: `https://img.icons8.com/material-outlined/100/${COLORS.textNH}/folder-invoices--v1.png`,
                }}
                alt='folder-up-button'
                style={app.icon}
              />
            </Pressable>
          )}
        </View>
      )
    }
  }
  const styles = {
    headerButton: {
      ...buttons.btn1,
      backgroundColor: COLORS.background,
      margin: 0,
      paddingLeft: 0,
    },
  }
  return headers;
}

/**
 * Finds and return cached note.
 * @param {number} id - note id
 * @param {QueryClient} queryClient - cache query
 * @param {number} userId - current user id
 * @returns {Object} - note in cache
 */
const findItemInCache = (id, userId, path) => {
  let folderId;
  if (path && Array.isArray(path)) {
    const index = path.findIndex(item => item.id === id)
    const pathItem = path[index - 1]
    folderId = pathItem?.id || null
  }

  const cachedData = queryClient.getQueryData(['folders', userId, folderId])
  if (Array.isArray(cachedData)) {
    const item = cachedData.find((f) => f.id === folderId || id)
    if (item) return item
  }
  return null // folder not found
}
