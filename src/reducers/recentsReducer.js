import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { queryClient } from '../contexts/AuthContext';

const STORAGE_KEY = 'RECENT_SCREENS';

export const addRecent = createAsyncThunk(
  'recents/addRecent',
  async (activeNote, { getState }) => {
    const state = getState().recents;

    // retrieve cache data
    const cachedNote = findItemInCache(activeNote.id, activeNote.userId, activeNote.folderId);

    // Remove duplicates
    let updated = state.data.filter(noteItem => noteItem.id !== activeNote.id);

    // Add to top
    updated.unshift({
      id: activeNote.id,
      title: cachedNote.title,
      user: activeNote.userId,
      folderId: cachedNote.folderId,
    });

    // Limit size (3)
    updated = updated.slice(0, 3);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    return updated;
  }
);

export const loadRecent = createAsyncThunk(
  'recents/loadRecent',
  async ({ userId }, { }) => {
    let unparsed = await AsyncStorage.getItem(STORAGE_KEY);
    if (unparsed) {
      unparsed = JSON.parse(unparsed);
      unparsed = unparsed.filter(noteItem => noteItem.userId === userId)
      return unparsed;
    }
    return [];
  }
);

export const removeRecent = createAsyncThunk(
  'recents/removeRecent',
  async ({ noteId }, { getState }) => {
    const state = getState().recents;
    let updated = state.data.filter(noteItem => noteItem.id !== noteId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
)

export const clearRecent = createAsyncThunk(
  'recents/clearRecent',
  async (_, { }) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    return [];
  }
)

const recentsSlice = createSlice({
  name: 'recents',
  initialState: {
    data: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addRecent.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(loadRecent.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(removeRecent.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(clearRecent.fulfilled, (state, action) => {
        state.data = action.payload; // []
      });
  },
});

/**
 * Finds and return cached note.
 * @param {number} id - note id
 * @param {QueryClient} queryClient - cache query
 * @param {number} userId - current user id
 * @returns {Object} - note in cache
 */
const findItemInCache = (id, userId, folderId) => {
  const data = queryClient.getQueryData(['notes', userId, folderId]);
  if (Array.isArray(data)) {
    const item = data.find(n => n.id === id);
    if (item) {
      return item;
    }
  }
  return null; // note not found
}

export default recentsSlice.reducer;