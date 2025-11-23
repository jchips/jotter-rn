import React, { useEffect, useState } from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'
import { useFocusEffect } from '@react-navigation/native'
import { useMarkdown } from '../src/contexts/MDContext'
import { useTheme } from '../src/contexts/ThemeContext'
import Loading from '../src/components/indicators/Loading'
import Preview from '../src/components/PreviewMarkdown'
import EditButton from '../src/components/buttons/EditButton'
import { useHeader } from '../src/hooks/useHeader'
import { useAppStyles } from '../src/styles'

const ViewNote = ({ navigation, route }) => {
  const { note } = route.params
  const [editBtnVisible, setEditBtnVisible] = useState(true)
  const [loading, setLoading] = useState(true)
  const { markdown, setMarkdown } = useMarkdown()
  const { app } = useAppStyles()
  const { COLORS } = useTheme()
  const header = useHeader()
  const { width: screenWidth } = useWindowDimensions()
  const styles = styleSheet(app)
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(setEditBtnVisible)(true)
    })

  const calculateHeaderLength = () => {
    if (screenWidth < 380 && note.title.length > 24) {
      return note.title.substring(0, 22) + '...'
    } else if (screenWidth < 440 && note.title.length > 26) {
      return note.title.substring(0, 24) + '...'
    } else {
      return note.title
    }
  }

  useEffect(() => {
    setLoading(true)
    navigation.setOptions({
      headerTitle: calculateHeaderLength(),
      headerTint: COLORS.themePurpleText,
      headerRight: () =>
        header.note({
          noteId: note.id,
          folderId: note.folderId,
          navigation,
          userId: note.userId,
        }),
    })
    setLoading(false)
  }, [navigation])

  useEffect(() => {
    setLoading(true)
    setMarkdown(note.content)
    setLoading(false)
  }, [note])

  useFocusEffect(
    React.useCallback(() => {
      const timer = setTimeout(() => {
        setEditBtnVisible(false)
      }, 5000)
      return () => clearTimeout(timer)
    }, [doubleTap])
  )

  // Loading circle
  if (loading) {
    return <Loading />
  }

  return (
    !loading && (
      <GestureHandlerRootView style={styles.container}>
        <GestureDetector gesture={doubleTap}>
          <View style={{ flex: 1 }}>
            <Preview note={note} markdown={markdown} />
            <EditButton
              navigation={navigation}
              note={note}
              editBtnVisible={editBtnVisible}
            />
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
    )
  )
}

const styleSheet = (app) =>
  StyleSheet.create({
    container: {
      ...app.container,
      paddingVertical: 10,
    },
    editBtn: {
      position: 'absolute',
      bottom: 0,
      left: 0,
    },
  })

export default ViewNote
