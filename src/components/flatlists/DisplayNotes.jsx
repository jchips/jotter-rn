import { useState } from 'react'
import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useAppStyles } from '../../styles'
import NoteCard from '../cards/NoteCard'
import Move from '../modals/Move'
import Rename from '../modals/Rename'
import Delete from '../modals/Delete'
import Details from '../modals/Details'
import { queryClient } from '../../contexts/AuthContext'
import api from '../../util/api'

const DisplayNotes = ({ notes, folders, error, gridSize, refreshKey }) => {
  const [openMove, setOpenMove] = useState(false)
  const [openRename, setOpenRename] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openDetails, setOpenDetails] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const navigation = useNavigation()
  const { app, COLORS } = useAppStyles()
  const numColumns = Number(gridSize) || 1

  /**
   * Renders a list of notes
   * @param {Object} param0 - The note item to be rendered
   * @returns - a note card that navigates to the note
   */
  const renderItem = ({ item }) => {
    const note = item
    return (
      <Pressable
        onPress={() => {
          queryClient.prefetchQuery({
            queryKey: ['note', note.userId, note.id],
            queryFn: () => api.getNote(note.id).then((r) => r.data),
          })
          navigation.navigate('View', {
            noteId: note?.id,
            title: note?.title,
            noteFolder: note?.folderId,
          })
        }}
      >
        <NoteCard
          note={note}
          setSelectedNote={setSelectedNote}
          setOpenRename={setOpenRename}
          setOpenDelete={setOpenDelete}
          setOpenMove={setOpenMove}
          setOpenDetails={setOpenDetails}
          numColumns={numColumns}
        />
      </Pressable>
    )
  }

  return (
    <View>
      {notes?.length === 0 && folders?.length === 0 ? (
        <View style={{ marginHorizontal: 10 }}>
          <Text style={{ color: COLORS.text }}>No notes.</Text>
        </View>
      ) : (
        <View>
          {error ? (
            <View style={app.errorAlert}>
              <Text style={app.errorText}>{error}</Text>
            </View>
          ) : null}
          <View>
            <FlatList
              data={notes}
              key={`${numColumns}-${refreshKey}`}
              renderItem={renderItem}
              numColumns={numColumns}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              columnWrapperStyle={
                numColumns > 1 ? { justifyContent: 'space-between' } : undefined
              }
              removeClippedSubviews={false}
            />
          </View>
        </View>
      )}
      <Rename
        openRename={openRename}
        setOpenRename={setOpenRename}
        note={selectedNote}
      />
      <Details
        note={selectedNote}
        openDetails={openDetails}
        setOpenDetails={setOpenDetails}
      />
      <Move
        navigation={navigation}
        openMove={openMove}
        setOpenMove={setOpenMove}
        type='note'
        note={selectedNote}
      />
      <Delete
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        note={selectedNote}
      />
    </View>
  )
}

const styles = StyleSheet.create({})

export default DisplayNotes
