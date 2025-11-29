/* Folding level 4 (VS Code, cmd/ctrl + k + 4) */
import { Pressable, View, Image } from 'react-native';
import { useAppStyles } from '../styles';
import { getFolderTitle } from '../util/getFolder';
import { queryClient, useAuth } from '../contexts/AuthContext';
import api from '../util/api';

export function useHeader() {
  const { user } = useAuth();
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
      } = props;
      return (
        <View style={{ flexDirection: 'row' }}>
          {/* Navigate folder up */}
          {folder_id && (
            <Pressable
              onPress={async () => {
                let folder = folderParent;
                if (folderParent !== null) {
                  folder = await getFolderTitle(folderParent);
                }
                queryClient.prefetchQuery({
                  queryKey: ['folders', user?.id, folderParent],
                  queryFn: () => api.getFolders(folderParent).then((r) => r.data),
                })
                return navigation.navigate('Drawer', {
                  screen: 'Home',
                  params: {
                    folderId: folderParent,
                    folderTitle: folder?.title || 'Home',
                    folderParent: folder?.parentId || null,
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
      } = props;
      return (
        <View style={{ flexDirection: 'row' }}>
          {/* Navigate folder up */}
          {noteId && (
            <Pressable
              onPress={async () => {
                let folder;
                if (folderId !== null) {
                  folder = await getFolderTitle(folderId);
                }
                queryClient.prefetchQuery({
                  queryKey: ['folders', user?.id, folderId],
                  queryFn: () => api.getFolders(folderId).then((r) => r.data),
                })
                return navigation.navigate('Drawer', {
                  screen: 'Home',
                  params: {
                    folderId: folderId,
                    folderTitle: folder?.title || 'Home',
                    folderParent: folder?.parentId || null,
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
 * Finds and return cached folder.
 * @param {number} id - folder id
 * @param {QueryClient} queryClient - cache query
 * @param {number} userId - current user id
 * @returns {Object} - folder in cache
 */
// const findItemInCache = (id, userId, path) => {
//   let folderId;
//   if (path && Array.isArray(path)) {
//     const index = path.findIndex(item => item.id === id)
//     const pathItem = path[index - 1]
//     folderId = pathItem?.id || null
//   }

//   const cachedData = queryClient.getQueryData(['folders', userId, folderId])
//   if (Array.isArray(cachedData)) {
//     const item = cachedData.find((f) => f.id === folderId || id)
//     if (item) return item
//   }
//   return null // folder not found
// }
