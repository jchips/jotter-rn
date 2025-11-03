import React, { useEffect, useState, useCallback } from 'react'
import {
  StyleSheet,
  ScrollView,
  View,
  Pressable,
  Image,
  Dimensions,
  useColorScheme,
  RefreshControl,
} from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
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
  const [refreshing, setRefreshing] = useState(false)
  const { COLORS, theme } = useTheme()
  const { token, logout } = useAuth()
  const { setMarkdown } = useMarkdown()
  const navigation = useNavigation()
  const { data } = useSelector((state) => state.configs)
  const dispatch = useDispatch()
  const { folder } = useFolder(folderId)
  const { app, buttons } = useAppStyles()
  const systemTheme = useColorScheme()
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

  /**
   * DB fetch for all folders and notes in the current folder
   * @param {Number} folder_id
   */
  const refresh = async (folder_id) => {
    try {
      setError('')
      const [foldersRes, notesRes] = await Promise.all([
        api.getFolders(folder_id),
        folder_id ? api.getNotes(folder_id) : api.getRootNotes(),
      ])
      setFolders(foldersRes.data)
      setNotes(notesRes.data)
    } catch (err) {
      console.error(err)
      if (err.response?.data?.message === 'jwt expired') {
        logUserOut()
      } else {
        setError('Could not fetch content')
      }
    }
  }

  /** For Drawer breadcrumbs */
  useFocusEffect(
    React.useCallback(() => {
      const fetchContent = async () => {
        setLoading(true)
        let folder_id = !folderId ? null : folderId
        await refresh(folder_id)
        setLoading(false)
      }
      fetchContent()
    }, [folderId])
  )

  // Pull-to-refresh
  const onRefresh = React.useCallback(() => {
    const refreshContent = async () => {
      try {
        setRefreshing(true)
        setError('')
        let folder_id = !folderId ? null : folderId
        await refresh(folder_id)
      } catch (err) {
        console.error(err)
        setError('Failed refresh')
      } finally {
        setRefreshing(false)
      }
    }
    refreshContent()
  }, [])

  // Logs the user out
  const logUserOut = () => {
    logout()
  }

  // Loading circle
  if (loading) {
    return <Loading />
  }

  return !loading ? (
    <View style={styles.container}>
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
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
