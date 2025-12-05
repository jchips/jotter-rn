import { useRef } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Dimensions,
  useWindowDimensions,
} from 'react-native'
import Popover from 'react-native-popover-view'
import { useTheme } from '../../contexts/ThemeContext'
import formatDate from '../../util/formatDate'
import { moderateScale } from '../../util/scaling'
import { useAppStyles } from '../../styles'
import { FONT, FONTSIZE, BORDER } from '../../styles'

// const screenWidth = Dimensions.get('window').width

const NoteCard = (props) => {
  const {
    note,
    setSelectedNote,
    setOpenRename,
    setOpenMove,
    setOpenDelete,
    setOpenDetails,
    numColumns,
  } = props
  const popoverRef = useRef()
  const { app, POPOVER, buttons } = useAppStyles()
  const { COLORS } = useTheme()
  const styles = styleSheet(app, COLORS)
  const { width: screenWidth } = useWindowDimensions()
  const itemWidth =
    (screenWidth -
      app.dashboardContainer.paddingHorizontal * (numColumns + 1)) /
    numColumns

  return (
    <View style={[styles.container, { width: itemWidth }]}>
      <View style={styles.h1Container}>
        <View>
          <Text style={styles.h1}>{note.title}</Text>
        </View>

        {/* Popover */}
        <Popover
          ref={popoverRef}
          from={
            <Pressable>
              <Image
                source={{
                  uri: `https://img.icons8.com/material-outlined/100/${COLORS.noteBtnNH}/more.png`,
                }}
                alt='more-icon'
                style={app.icon2}
              />
            </Pressable>
          }
          arrowSize={{ width: 0, height: 0 }}
          popoverStyle={styles.popover}
        >
          <View style={POPOVER.popoverContainer}>
            <Pressable
              style={POPOVER.button}
              onPress={() => {
                setSelectedNote(note)
                setOpenRename(true)
                popoverRef.current.requestClose()
              }}
            >
              <Image
                source={{
                  uri: `https://img.icons8.com/material-outlined/100/${COLORS.textNH}/rename.png`,
                }}
                alt='rename-icon'
                style={app.icon2}
              />
              <Text style={buttons.btnText2}>Rename note</Text>
            </Pressable>
            <Pressable
              style={POPOVER.button}
              onPress={() => {
                setSelectedNote(note)
                setOpenDetails(true)
                popoverRef.current.requestClose()
              }}
            >
              <Image
                source={{
                  uri: `https://img.icons8.com/material-outlined/100/${COLORS.textNH}/info--v1.png`,
                }}
                alt='details-icon'
                style={app.icon2}
              />
              <Text style={buttons.btnText2}>View details</Text>
            </Pressable>
            <Pressable
              style={POPOVER.button}
              onPress={() => {
                setSelectedNote(note)
                setOpenMove(true)
                popoverRef.current.requestClose()
              }}
            >
              <Image
                source={{
                  uri: `https://img.icons8.com/material-outlined/100/${COLORS.textNH}/reorder.png`,
                }}
                alt='move-icon'
                style={app.icon2}
              />
              <Text style={buttons.btnText2}>Move note</Text>
            </Pressable>
            <Pressable
              style={POPOVER.button}
              onPress={() => {
                setSelectedNote(note)
                setOpenDelete(true)
                popoverRef.current.requestClose()
              }}
            >
              <Image
                source={{
                  uri: `https://img.icons8.com/material-outlined/100/${COLORS.textNH}/trash--v1.png`,
                }}
                alt='delete-icon'
                style={app.icon2}
              />
              <Text style={buttons.btnText2}>Delete note</Text>
            </Pressable>
          </View>
        </Popover>
      </View>
      <View>
        <Text style={styles.metaData}>{formatDate(note.createdAt)}</Text>
        <Text style={styles.metaData}>{formatDate(note.updatedAt)}</Text>
      </View>
    </View>
  )
}

const styleSheet = (app, COLORS) =>
  StyleSheet.create({
    container: {
      ...app.itemCard,
    },
    h1Container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 1,
      flexWrap: 'wrap',
      marginBottom: 10,
    },
    h1: {
      fontSize: moderateScale(FONTSIZE.regular),
      fontFamily: FONT.bold,
      color: COLORS.text,
    },
    metaData: {
      fontSize: moderateScale(FONTSIZE.smaller),
      fontFamily: FONT.regular,
      color: COLORS.mutedtext,
    },
    popover: {
      borderRadius: BORDER.radius,
      minHeight: moderateScale(190),
      width: moderateScale(170),
      backgroundColor: COLORS.cardBg,
    },
  })

export default NoteCard
