/* Folding level 4 (VS Code, cmd/ctrl + k + 4) */
import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  ScrollView,
  View,
  useColorScheme,
  RefreshControl,
  Dimensions,
} from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { fetchConfigs } from '../src/reducers/configReducer'
import { useMarkdown } from '../src/contexts/MDContext'
import { queryClient, useAuth } from '../src/contexts/AuthContext'
import { useTheme } from '../src/contexts/ThemeContext'
import { useFolder } from '../src/hooks/useFolder'
import { useHeader } from '../src/hooks/useHeader'
import { useAppStyles } from '../src/styles'
import Loading from '../src/components/indicators/Loading'
import DisplayFolders from '../src/components/flatlists/DisplayFolders'
import DisplayNotes from '../src/components/flatlists/DisplayNotes'
import AddButton from '../src/components/buttons/AddButton'
import Sort from '../src/components/modals/Sort'
import Grid from '../src/components/modals/Grid'
import AddTitle from '../src/components/modals/AddTitle'
import { sortFolders, sortNotes } from '../src/util/sortBy'
import api from '../src/util/api'

const Dashboard = ({ route }) => {
  const { folderId, folderTitle, folderParent } = route.params
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
  const configSettings = useSelector((state) => state.configs.data)
  const dispatch = useDispatch()
  const { folder } = useFolder(folderId)
  const { app, buttons } = useAppStyles()
  const systemTheme = useColorScheme()
  const header = useHeader()
  const styles = styleSheet(app, buttons, COLORS)
  const screenWidth = Dimensions.get('window').width
  const userId = !user?.id ? null : user.id
  let folder_id = !folderId ? null : folderId

  useEffect(() => {
    dispatch(fetchConfigs(token))
  }, [dispatch])

  useEffect(() => {
    setMarkdown('')
  }, [])

  // Header
  useFocusEffect(
    React.useCallback(() => {
      // Header settings
      navigation.setOptions({
        headerTitle:
          screenWidth < 440 && folderTitle.length > 16
            ? folderTitle.substring(0, 16) + '...'
            : folderTitle,
        headerRight: () =>
          header.dashboard({
            setOpenGrid,
            setOpenSort,
            folderParent,
            folder_id,
            configSettings,
            navigation,
          }),
      })
    }, [navigation, route, configSettings, systemTheme, theme])
  )

  // Fetch and cache folders
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
    select: (foldersRes) => {
      const sortedFolders = sortFolders(configSettings?.sort, foldersRes)
      return sortedFolders
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

  // Fetch and cache notes
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
    select: (notesRes) => {
      const sortedNotes = sortNotes(configSettings?.sort, notesRes)
      return sortedNotes
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

  // Sync folder cache data
  useEffect(() => {
    setLoading(true)
    if (cachedFolders) setFolders(cachedFolders)
    setLoading(false)
  }, [cachedFolders])

  // Sync note cache data
  useEffect(() => {
    setLoading(true)
    if (cachedNotes) setNotes(cachedNotes)
    setLoading(false)
  }, [cachedNotes])

  const isLoading = foldersLoading || notesLoading

  // Reset cache
  const onRefresh = async () => {
    setLoading(true)
    queryClient.invalidateQueries()
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
            gridSize={configSettings?.gridSize}
            error={error}
          />
        ) : null}
        {notes ? (
          <DisplayNotes
            notes={notes}
            folders={folders}
            gridSize={configSettings?.gridSize}
            error={error}
            refreshKey={refreshKey}
          />
        ) : null}
      </ScrollView>
      <AddButton setOpenAddTitle={setOpenAddTitle} setType={setType} />
      <AddTitle
        openAddTitle={openAddTitle}
        setOpenAddTitle={setOpenAddTitle}
        type={type}
        currentFolder={folder}
      />
      <Sort
        openSort={openSort}
        setOpenSort={setOpenSort}
        currentSort={configSettings?.sort}
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
