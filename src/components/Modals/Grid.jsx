import { useState } from 'react';
import { StyleSheet, View, Modal, Text, Pressable } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';
import DropdownBtn from '../Buttons/DropdownBtn';
import api from '../../util/api';
import { setConfigs } from '../../reducers/configReducer';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppStyles } from '../../styles';

let gridOptions = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
];

const Grid = (props) => {
  const { openGrid, setOpenGrid } = props;
  const configs = useSelector((state) => state.configs.data);
  const [grid, setGrid] = useState(configs?.gridSize);
  const { app, MODAL, buttons } = useAppStyles();
  const { COLORS } = useTheme();
  const styles = styleSheet(MODAL, COLORS);
  const dispatch = useDispatch();

  /**
   * Updates the user's new grid option in the db and global state
   * @param {String} gridOption - The selected grid option
   */
  const setUConfigs = (gridOption) => {
    const updateGrid = async (gridOption) => {
      let configObj = { gridSize: gridOption };
      try {
        let res = await api.updateConfigs(configObj);
        dispatch(setConfigs({ ...res.data, ...configObj }));
      } catch (err) {
        console.error('Failed to update grid -', err);
      }
    };
    updateGrid(gridOption);
  };

  // Dropdown button default text
  const dropdownBtnText = () => {
    return <Text>Choose grid size</Text>;
  };

  /**
   * Renders a grid option
   * @param {Object} item - Grid option
   * @param {Integer} index - The index of grid option in dropdown
   * @param {Boolean} isSelected - Whether the grid option is selected or not
   * @returns - The grid option item
   */
  const renderItem = (item, index, isSelected) => {
    return (
      <View
        style={{
          ...MODAL.dropdownItemStyle,
          ...(isSelected && { backgroundColor: COLORS.graySubtle }),
        }}
      >
        <Text style={styles.dropdownItemTxtStyle}>{item.label}</Text>
      </View>
    );
  };

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={openGrid}
      onRequestClose={() => {
        setOpenGrid(!openGrid);
      }}
    >
      <View style={MODAL.centeredView}>
        <View style={MODAL.modal}>
          <Text style={app.header}>Grid size</Text>
          <SelectDropdown
            data={gridOptions}
            defaultValueByIndex={grid - 1}
            onSelect={(selection, index) => {
              setGrid(selection.value);
              setUConfigs(selection.value);
              setOpenGrid(false);
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
              setOpenGrid(!openGrid);
            }}
          >
            <Text style={buttons.btnText1}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styleSheet = (MODAL, COLORS) =>
  StyleSheet.create({
    dropdownItemTxtStyle: {
      ...MODAL.dropdownItemTxtStyle,
      color: COLORS.themePurpleText,
    },
  });

export default Grid;
