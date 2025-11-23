import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { queryClient } from '../contexts/AuthContext';

const STORAGE_KEY = 'RECENTS_SCREENS';

export const addRecent = createAsyncThunk(
  'recents/addRecent',
  async ({ id, name, userId }, { getState }) => {
    const state = getState().recents;

    // retrieve cache data
    const cached = findItemInCache(id, queryClient, userId);
    const finalName = cached?.name || name;

    // Remove duplicates
    let updated = state.data.filter(noteItem => noteItem.id !== id);

    // Add to top
    updated.unshift({ id, name: finalName, userId: userId });

    // Limit size (4)
    updated = updated.slice(0, 4);

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
      .addCase(clearRecent.fulfilled, (state, action) => {
        state.data = action.payload; // []
      });
  },
});

const findItemInCache = (id, queryClient, userId) => {
  const queries = queryClient.getQueryCache().findAll();

  for (const q of queries) {
    const key = q.queryKey;

    // NOTES: ['notes', userId, folder_id]
    if (key[0] === 'notes' && key[1] === userId) {
      const data = queryClient.getQueryData(key);
      if (Array.isArray(data)) {
        const item = data.find(n => n.id === id);
        if (item) return { name: item.title };
      }
    }
  }
  return null; // note not found
}

export default recentsSlice.reducer;