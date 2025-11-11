import { useState } from 'react'
import { StyleSheet, View, FlatList, Pressable, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useAppStyles } from '../../styles'
import Delete from '../Modals/Delete'
import FolderCard from './FolderCard'
import Move from '../Modals/Move'
import Rename from '../Modals/Rename'
import Details from '../Modals/Details'

const DisplayFolders = ({ folders, error, gridSize }) => {
  const [openMove, setOpenMove] = useState(false)
  const [openRename, setOpenRename] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openDetails, setOpenDetails] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState(null)
  const { app } = useAppStyles()
  const navigation = useNavigation()
  const numColumns = Number(gridSize) || 1

  /**
   * Renders list of folders
   * @param {Object} param0 - The folder item to be rendered
   * @returns - a folder card that navigates inside folder
   */
  const renderItem = ({ item }) => {
    const folder = item
    return (
      <Pressable
        onPress={() => {
          navigation.push('Drawer', {
            screen: 'Home',
            params: { folderId: folder.id, folderTitle: folder.title },
          })
        }}
      >
        <FolderCard
          folder={folder}
          setSelectedFolder={setSelectedFolder}
          setOpenRename={setOpenRename}
          setOpenDelete={setOpenDelete}
          setOpenMove={setOpenMove}
          setOpenDetails={setOpenDetails}
          numColumns={numColumns}
        />
      </Pressable>
    )
  }

  return folders?.length > 0 ? (
    <View>
      {error ? (
        <View style={app.errorAlert}>
          <Text style={app.errorText}>{error}</Text>
        </View>
      ) : null}
      <FlatList
        data={folders}
        key={numColumns}
        renderItem={renderItem}
        numColumns={numColumns}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={
          numColumns > 1 ? { justifyContent: 'space-between' } : undefined
        }
        removeClippedSubviews={false}
      />
      <Rename
        openRename={openRename}
        setOpenRename={setOpenRename}
        folder={selectedFolder}
      />
      <Move
        navigation={navigation}
        openMove={openMove}
        setOpenMove={setOpenMove}
        type='folder'
        folder={selectedFolder}
      />
      <Details
        folder={selectedFolder}
        openDetails={openDetails}
        setOpenDetails={setOpenDetails}
      />
      <Delete
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        folder={selectedFolder}
      />
    </View>
  ) : null
}

const styles = StyleSheet.create({})

export default DisplayFolders
