import { useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import api from '../../util/api';
import DropdownBtn from '../Buttons/DropdownBtn';
import { useFolder } from '../../hooks/useFolder';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppStyles } from '../../styles';
import { FONT, FONTSIZE } from '../../styles';
// import { app, buttons, COLORS, FONT, FONTSIZE, MODAL } from '../../styles';

const Move = (props) => {
  const { navigation, openMove, setOpenMove, type, note, folder } = props;
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formattedFolders, setFormattedFolders] = useState([]);
  const { app, MODAL, buttons } = useAppStyles();
  const { COLORS } = useTheme();
  const { childFolders } = useFolder(folder ? folder.id : null);
  let folders = childFolders.data;

  /**
   * Fetch all folders that the user can move current folder to
   * This includes all folder except the current folder, any of the
   * current folder's inner folders, and the parent folder of the current
   * folder (because it's already in that one)
   */
  useEffect(() => {
    let folderId = note?.folderId || folder?.id;
    let parentId = note?.folderId || folder?.parentId;
    const getAllFolders = async () => {
      try {
        let res = await api.getAllFolders(folderId ? folderId : 'null', type);
        let formatFolders = res.data
          .map((folder) => {
            let parsedPath =
              typeof folder.path === 'string'
                ? JSON.parse(folder.path)
                : folder.path;
            return {
              label: folder.title,
              value: folder.id,
              path: parsedPath,
            };
          })
          .filter((formattedFolder) => formattedFolder.value !== parentId); // filter out parent folder
        setFormattedFolders(formatFolders);
      } catch (err) {
        console.error('Failed to fetch folders: ', err);
      } finally {
        setLoading(false);
      }
    };
    note || folder ? getAllFolders() : null;
  }, [note, folder, folders, type]);

  let folderOpts;

  // If user is already in root folder, do not add it as an option
  if (type === 'note') {
    folderOpts =
      !note?.folderId || note?.folderId === 'null'
        ? [...formattedFolders]
        : [{ label: 'Home', value: 'null', path: [] }, ...formattedFolders];
  } else {
    folderOpts =
      !folder || !folder?.parentId || folder?.parentId === 'null'
        ? [...formattedFolders]
        : [{ label: 'Home', value: 'null', path: [] }, ...formattedFolders];
  }

  /**
   * Moves the note or folder to chosen location
   * @param {Object} folderTarget - The folder to move to
   */
  const move = async (folderTarget) => {
    try {
      setSaving(true);
      let moveToFolder = await getFolder(folderTarget.value);
      let parsedTargetPath =
        typeof moveToFolder.path === 'string'
          ? JSON.parse(moveToFolder.path)
          : moveToFolder.path;
      switch (type) {
        case 'note':
          await api.updateNote(
            {
              folderId:
                folderTarget.value === 'null' ? null : folderTarget.value,
            },
            note.id
          );
          break;
        case 'folder':
          let res = await api.updateFolder(
            {
              parentId:
                folderTarget.value === 'null' ? null : folderTarget.value,
              path: moveToFolder
                ? [
                    ...parsedTargetPath,
                    { id: moveToFolder.id, title: moveToFolder.title },
                  ]
                : [],
            },
            folder.id
          );
          let updatedFolderPath =
            typeof res.data.path === 'string'
              ? JSON.parse(res.data.path)
              : res.data.path;
          folders?.length !== 0 &&
            getChildren(
              folder.id,
              moveToFolder,
              updatedFolderPath,
              folder.path
            );
          break;
      }
      setOpenMove(false);
      navigation.push('Drawer', {
        screen: 'Home',
        params: {
          folderId: folderTarget.value,
          folderTitle: moveToFolder?.title ? moveToFolder?.title : 'Home',
        },
      });
    } catch (err) {
      setError('Failed to move folder');
      console.error('Failed to move folder - ', err);
    }
    setSaving(false);
  };

  /**
   * Gets the folder that item will be moved to
   * @param {Integer} moveFolderId - The id of the folder to move to
   * @returns {Object} - The folder object
   */
  const getFolder = async (moveFolderId) => {
    try {
      let res = await api.getFolder(moveFolderId);
      return res.data;
    } catch (err) {
      console.error('Failed to fetch folder - ', err);
      return {};
    }
  };

  /**
   * Updates the path of the child folder given
   * @param {Object} child - The folder to update
   * @param {Object} moveToFolder - The folder that current folder will be moved to
   * @param {Object[]} folderPath - The updated path of the current folder
   * @param {Object[]} orgFolderPath - The original path of the current folder
   */
  const updateInnerPath = async (
    child,
    moveToFolder,
    folderPath,
    orgFolderPath
  ) => {
    let path;
    let childPath =
      typeof child.path === 'string' ? JSON.parse(child.path) : child.path;
    let parsedTargetPath =
      typeof moveToFolder.path === 'string'
        ? JSON.parse(moveToFolder.path)
        : moveToFolder.path;
    let index = childPath.findIndex(
      (pathItem) => pathItem.id === folder.id && pathItem.title === folder.title
    );
    let updatedChildPath = childPath.slice(index + 1);
    if (orgFolderPath.length === 0 && moveToFolder) {
      // Moving from root to a new folder
      path = [
        ...parsedTargetPath,
        { id: moveToFolder.id, title: moveToFolder.title },
        ...updatedChildPath,
      ];
    } else {
      // Moving from one folder to another
      path = [
        ...folderPath,
        { id: folder.id, title: folder.title },
        ...updatedChildPath,
      ];
    }
    try {
      await api.updateFolder(
        {
          path: path,
        },
        child.id
      );
    } catch (err) {
      console.error('Failed to update path - ', child.title, child.id, err);
    }
  };

  /**
   * Gets the child folders of the current folder and updates their paths.
   * @param {Integer} parentId - The id of the current folder (it will the parent on recall)
   * @param {Object} moveToFolder - The folder that current folder will be moved to
   * @param {Object[]} folderPath - The updated path of the current folder
   * @param {Object} orgFolderPath - The original path of the current folder
   * @returns - exit the recursive function once there are no more child folders
   */
  const getChildren = async (
    parentId,
    moveToFolder,
    folderPath,
    orgFolderPath
  ) => {
    try {
      let children = await api.getFolders(parentId);
      children = children.data;
      if (children.length === 0) {
        return;
      } else {
        for (const child of children) {
          await updateInnerPath(child, moveToFolder, folderPath, orgFolderPath);
          await getChildren(child.id, moveToFolder, folderPath, orgFolderPath);
        }
      }
    } catch (err) {
      console.error('Failed to fetch child folders', err);
    }
  };

  // Dropdown button default text
  const dropdownBtnText = () => {
    return (
      <Text>
        Select folder to move{' '}
        <Text style={{ fontFamily: FONT.bold }}>
          {type === 'note' ? note.title : folder.title}
        </Text>{' '}
        to
      </Text>
    );
  };

  /**
   * Renders a folder option
   * @param {Object} item - Folder option
   * @param {Integer} index - The index of folder option in dropdown
   * @param {Boolean} isSelected - Whether the folder is selected or not
   * @returns - The folder option item
   */
  const renderItem = (item, index, isSelected) => {
    return (
      <View
        style={{
          ...MODAL.dropdownItemStyle,
          ...(isSelected && { backgroundColor: COLORS.graySubtle }),
        }}
      >
        <Text style={MODAL.dropdownItemTxtStyle}>
          {item.label}{' '}
          <Text style={{ color: COLORS.mutedtext, fontSize: FONTSIZE.small }}>
            {item.path.map((pathItem) => pathItem.title).join(' > ')}
          </Text>
        </Text>
      </View>
    );
  };

  return note || folder ? (
    !loading ? (
      <Modal
        animationType='fade'
        transparent={true}
        visible={openMove}
        onRequestClose={() => {
          setOpenMove(!openMove);
        }}
      >
        <View style={MODAL.centeredView}>
          <View style={MODAL.modal}>
            <Text style={app.header}>Move {type}</Text>
            {error ? (
              <View style={app.errorAlert}>
                <Text style={app.errorText}>{error}</Text>
              </View>
            ) : null}
            {folderOpts.length < 1 ? (
              <View style={styles.noMoveOptions}>
                <Text>No folder options</Text>
              </View>
            ) : (
              <SelectDropdown
                data={folderOpts}
                onSelect={(selection, index) => {
                  move(selection);
                }}
                renderButton={(selectedItem, isOpened) =>
                  DropdownBtn(
                    selectedItem,
                    isOpened,
                    dropdownBtnText,
                    saving,
                    '95%',
                    COLORS
                  )
                }
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                dropdownStyle={MODAL.dropdownMenuStyle}
              />
            )}
            {saving ? (
              <ActivityIndicator
                size='large'
                color={COLORS.text}
                style={{ marginBottom: 5 }}
              />
            ) : null}
            <Pressable
              style={[buttons.btn1, MODAL.wideButton]}
              onPress={() => {
                setOpenMove(!openMove);
              }}
            >
              <Text style={buttons.btnText1}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    ) : null
  ) : null;
};

const styles = StyleSheet.create({
  noMoveOptions: {
    padding: 10,
  },
});

export default Move;
