import { useRef } from 'react'
import { StyleSheet, Image, Pressable, View, Text } from 'react-native'
import Popover from 'react-native-popover-view'
import { moderateScale } from '../../util/scaling'
import { useTheme } from '../../contexts/ThemeContext'
import { BORDER, useAppStyles } from '../../styles'

const AddButton = ({ setOpenAddTitle, setType }) => {
  const popoverRef = useRef()
  const { COLORS } = useTheme()
  const { app, buttons, POPOVER } = useAppStyles()
  const styles = styleSheet(buttons, COLORS, POPOVER)

  return (
    <Popover
      ref={popoverRef}
      from={
        <Pressable style={buttons.roundBtn}>
          <Image
            source={{
              uri: `https://img.icons8.com/material-outlined/100/${COLORS.whiteNH}/plus-math--v1.png`,
            }}
            alt='add-icon'
            style={app.icon}
          />
        </Pressable>
      }
      arrowSize={{ width: 0, height: 0 }}
      offset={7}
      popoverStyle={styles.popover}
    >
      <View style={POPOVER.popoverContainer}>
        {/* Add folder */}
        <Pressable
          style={styles.popoverButton}
          onPress={() => {
            setType('folder')
            setOpenAddTitle(true)
            popoverRef.current.requestClose()
          }}
        >
          <Image
            source={{
              uri: `https://img.icons8.com/material-outlined/100/${COLORS.textNH}/folder-invoices--v1.png`,
            }}
            alt='folder-icon'
            style={app.icon}
          />
          <Text style={buttons.btnText2}>New Folder</Text>
        </Pressable>

        {/* Add note */}
        <Pressable
          style={styles.popoverButton}
          onPress={() => {
            setType('note')
            setOpenAddTitle(true)
            popoverRef.current.requestClose()
          }}
        >
          <Image
            source={{
              uri: `https://img.icons8.com/material-outlined/100/${COLORS.textNH}/file.png`,
            }}
            alt='note-icon'
            style={app.icon}
          />
          <Text style={buttons.btnText2}>New Note</Text>
        </Pressable>
      </View>
    </Popover>
  )
}

const styleSheet = (buttons, COLORS, POPOVER) =>
  StyleSheet.create({
    popover: {
      borderRadius: BORDER.radius,
      minHeight: moderateScale(115),
      width: moderateScale(160),
      backgroundColor: COLORS.cardBg,
    },
    popoverContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      paddingVertical: '4%',
    },
    popoverButton: {
      ...POPOVER.button,
      justifyContent: 'space-between',
    },
  })

export default AddButton
