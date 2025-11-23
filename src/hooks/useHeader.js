/* Folding level 4 (VS Code, cmd/ctrl + k + 4) */
import { Pressable, View, Image } from 'react-native';
import { useAppStyles } from '../styles';
import { queryClient, useAuth } from '../contexts/AuthContext';

export function useHeader() {
  const { app, buttons, COLORS } = useAppStyles();
  const { user } = useAuth();

  const headers = {
    dashboard: (props) => {
      const {
        setOpenGrid,
        setOpenSort,
        // findItemInCache,
        folderParent,
        folder_id,
        configSettings,
        navigation
      } = props;
      return (
        <View style={{ flexDirection: 'row' }}>
          {/* Navigate folder up */}
          {folder_id && (
            <Pressable
              onPress={() => {
                let cachedFolder = findItemInCache(folderParent, user?.id)
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
        navigation
      } = props;
      return (
        <View style={{ flexDirection: 'row' }}>
          {/* Navigate folder up */}
          {noteId && (
            <Pressable
              onPress={() => {
                let cachedFolder = findItemInCache(folderId, user?.id)
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
                  // uri: `https://img.icons8.com/material-outlined/100/${COLORS.themeBtnNH}/up.png`
                  uri: `https://img.icons8.com/material-outlined/100/${COLORS.textNH}/folder-invoices--v1.png`,
                }}
                alt='folder-up-button'
                style={app.icon2}
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
const findItemInCache = (id, userId) => {
  const queries = queryClient.getQueryCache().findAll({ queryKey: ['folders', userId] })

  for (const q of queries) {
    const key = q.queryKey

    // FOLDERS: ['folders', userId, parent_id]
    if (key[0] === 'folders' && key[1] === userId) {
      const cachedData = queryClient.getQueryData(key)
      if (Array.isArray(cachedData)) {
        const item = cachedData.find((f) => f.id === id)
        if (item) return item
      }
    }
  }
  return null // folder not found
}
