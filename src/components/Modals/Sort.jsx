import { Modal, StyleSheet, View, Text, Pressable } from 'react-native'
import { useDispatch } from 'react-redux'
import SelectDropdown from 'react-native-select-dropdown'
import DropdownBtn from '../Buttons/DropdownBtn'
import api from '../../util/api'
import { setConfigs } from '../../reducers/configReducer'
import { useTheme } from '../../contexts/ThemeContext'
import { useAppStyles } from '../../styles'

let sortOptions = [
  { label: 'Last created', value: '1' },
  { label: 'First created', value: '2' },
  { label: 'Title - AZ', value: '3' },
  { label: 'Title - ZA', value: '4' },
  { label: 'Recently updated', value: '5' },
  { label: 'Oldest updated', value: '6' },
]

const Sort = (props) => {
  const { openSort, setOpenSort, currentSort } = props
  const { app, MODAL, buttons } = useAppStyles()
  const { COLORS } = useTheme()
  const styles = styleSheet(COLORS, MODAL)
  const dispatch = useDispatch() // Switch statement to perform chosen sort

  /**
   * Updates the user's new sort option in the db, global state,
   * and local storage
   * @param {String} sortOption - The selected sort option
   */
  const setUConfigs = (sortOption) => {
    const updateSort = async (sortOption) => {
      let configObj = { sort: sortOption }
      try {
        let res = await api.updateConfigs(configObj)
        dispatch(setConfigs({ ...res.data, ...configObj }))
      } catch (err) {
        console.error('Failed to update sort -', err)
      }
    }
    updateSort(sortOption)
  }

  /**
   * Dropdown button default text
   * @returns <Text> element
   */
  const dropdownBtnText = () => {
    return <Text>Choose sort</Text>
  }

  /**
   * Renders a sort option
   * @param {Object} item - Sort option
   * @param {Integer} index - The index of sort option in dropdown
   * @param {Boolean} isSelected - Whether the sort option is selected or not
   * @returns - The sort option item
   */
  const renderItem = (item, index, isSelected) => {
    return (
      <View
        style={{
          ...MODAL.dropdownItemStyle,
          ...(isSelected && { backgroundColor: COLORS.subtle }),
        }}
      >
        <Text style={styles.dropdownItemTxtStyle}>{item.label}</Text>
      </View>
    )
  }

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={openSort}
      onRequestClose={() => {
        setOpenSort(!openSort)
      }}
    >
      <View style={MODAL.centeredView}>
        <View style={MODAL.modal}>
          <Text style={app.header}>Sort</Text>
          <SelectDropdown
            data={sortOptions}
            defaultValueByIndex={currentSort - 1}
            onSelect={(selection, index) => {
              setUConfigs(selection.value)
              setOpenSort(false)
            }}
            renderButton={(selectedItem, isOpened) =>
              DropdownBtn(
                selectedItem,
                isOpened,
                dropdownBtnText,
                false,
                '95%',
                COLORS
              )
            }
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            dropdownStyle={MODAL.dropdownMenuStyle}
          />
          <Pressable
            style={[buttons.btn1, MODAL.wideButton]}
            onPress={() => {
              setOpenSort(!openSort)
            }}
          >
            <Text style={buttons.btnText1}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const styleSheet = (COLORS, MODAL) =>
  StyleSheet.create({
    dropdownItemTxtStyle: {
      ...MODAL.dropdownItemTxtStyle,
      color: COLORS.themePurpleText,
    },
  })

export default Sort
