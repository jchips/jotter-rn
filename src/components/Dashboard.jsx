import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  ScrollView,
  View,
  Pressable,
  Image,
  useColorScheme,
  RefreshControl,
  Dimensions,
} from 'react-native'
import {
  useFocusEffect,
  useNavigation,
  useIsFocused,
} from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { fetchConfigs } from '../reducers/configReducer'
import { useMarkdown } from '../contexts/MDContext'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useFolder } from '../hooks/useFolder'
import { useAppStyles } from '../styles'
import Loading from './Loading'
import DisplayFolders from './Display/DisplayFolders'
import DisplayNotes from './Display/DisplayNotes'
import AddButton from './Buttons/AddButton'
import Sort from './Modals/Sort'
import Grid from './Modals/Grid'
import AddTitle from './Modals/AddTitle'
import api from '../util/api'

const Dashboard = ({ route }) => {
  const { folderId, folderTitle } = route.params
  const [notes, setNotes] = useState()
  const [folders, setFolders] = useState()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState(null)
  const [openSort, setOpenSort] = useState(false)
  const [openGrid, setOpenGrid] = useState(false)
  const [openAddTitle, setOpenAddTitle] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const { COLORS, theme } = useTheme()
  const { token, logout, user } = useAuth()
  const { setMarkdown } = useMarkdown()
  const navigation = useNavigation()
  const { data } = useSelector((state) => state.configs)
  const dispatch = useDispatch()
  const { folder } = useFolder(folderId)
  const { app, buttons } = useAppStyles()
  const systemTheme = useColorScheme()
  const isFocused = useIsFocused()
  const styles = styleSheet(app, buttons, COLORS)
  const screenWidth = Dimensions.get('window').width

  useEffect(() => {
    dispatch(fetchConfigs(token))
  }, [dispatch])

  useEffect(() => {
    setMarkdown('')
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      // Header settings
      navigation.setOptions({
        headerTitle:
          screenWidth < 440 && folderTitle.length > 20
            ? folderTitle.substring(0, 20) + '...'
            : folderTitle,
        headerRight: () => {
          return (
            <View style={{ flexDirection: 'row' }}>
              <Pressable
                onPress={() => {
                  setOpenGrid(true)
                }}
                style={styles.headerButton}
              >
                <Image
                  source={{
                    uri:
                      data?.gridSize === '2'
                        ? `https://img.icons8.com/material-outlined/100/${COLORS.themeBtnNH}/rows.png`
                        : `https://img.icons8.com/material-outlined/100/${COLORS.themeBtnNH}/grid-2.png`,
                  }}
                  alt='grid-button'
                  style={app.icon}
                />
              </Pressable>
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
      })
    }, [navigation, route, data, systemTheme, theme])
  )

  const userId = !user?.id ? null : user.id
  let folder_id = !folderId ? null : folderId

  const {
    data: cachedFolders,
    error: foldersError,
    isLoading: foldersLoading,
    refetch: refetchFolders,
  } = useQuery({
    queryKey: ['folders', userId, folder_id],
    queryFn: async () => {
      const res = await api.getFolders(folder_id)
      return res.data
    },
    staleTime: 2 * 60 * 1000, // 2 min
    onError: (err) => {
      if (err?.response?.data?.message === 'jwt expired') {
        logUserOut()
      } else {
        setError('Could not fetch folders', err)
      }
    },
  })

  const {
    data: cachedNotes,
    error: notesError,
    isLoading: notesLoading,
    refetch: refetchNotes,
  } = useQuery({
    queryKey: ['notes', userId, folder_id],
    queryFn: async () => {
      let res
      if (folder_id) {
        res = await api.getNotes(folder_id)
      } else {
        res = await api.getRootNotes()
      }
      return res.data
    },
    staleTime: 2 * 60 * 1000, // 2 min
    onError: (err) => {
      if (err?.response?.data?.message === 'jwt expired') {
        logUserOut()
      } else {
        setError('Could not fetch notes', err)
      }
    },
  })

  // Sync cache data
  useEffect(() => {
    setLoading(true)
    if (cachedFolders) setFolders(cachedFolders)
    setLoading(false)
  }, [cachedFolders])

  useEffect(() => {
    setLoading(true)
    if (cachedNotes) setNotes(cachedNotes)
    setLoading(false)
  }, [cachedNotes])

  const isLoading = foldersLoading || notesLoading

  const onRefresh = async () => {
    setLoading(true)
    await Promise.all([refetchFolders(), refetchNotes()])
    setRefreshKey((prev) => prev + 1)
    setLoading(false)
  }

  // Logs the user out
  const logUserOut = () => {
    logout()
  }

  // Loading circle
  if (isLoading || loading) {
    return <Loading />
  }

  return !isLoading && !loading ? (
    <View style={styles.container}>
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
            colors={[COLORS.themePurple]}
            progressBackgroundColor={COLORS.background}
          />
        }
      >
        {folders ? (
          <DisplayFolders
            folders={folders}
            setFolders={setFolders}
            gridSize={data?.gridSize}
            error={error}
          />
        ) : null}
        {notes ? (
          <DisplayNotes
            notes={notes}
            setNotes={setNotes}
            folders={folders}
            gridSize={data?.gridSize}
            error={error}
            refreshKey={refreshKey}
            isFocused={isFocused}
          />
        ) : null}
      </ScrollView>
      <AddButton setOpenAddTitle={setOpenAddTitle} setType={setType} />
      <AddTitle
        openAddTitle={openAddTitle}
        setOpenAddTitle={setOpenAddTitle}
        type={type}
        notes={notes}
        setNotes={setNotes}
        folders={folders}
        setFolders={setFolders}
        currentFolder={folder}
      />
      <Sort
        openSort={openSort}
        setOpenSort={setOpenSort}
        folders={folders}
        notes={notes}
        setNotes={setNotes}
        setFolders={setFolders}
      />
      <Grid openGrid={openGrid} setOpenGrid={setOpenGrid} />
    </View>
  ) : null
}

const styleSheet = (app, buttons, COLORS) =>
  StyleSheet.create({
    container: {
      ...app.container,
      ...app.dashboardContainer,
    },
    headerButton: {
      ...buttons.btn1,
      backgroundColor: COLORS.background,
      margin: 0,
      paddingLeft: 0,
    },
  })

export default Dashboard
