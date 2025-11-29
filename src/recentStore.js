import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { queryClient } from './contexts/AuthContext';

const STORAGE_KEY = 'RECENT_SCREENS';

export const useRecentStore = create((set, get) => ({
  recent: [],

  addRecent: (item) => {
    let { id, userId, folderId } = item;

    // Pull updated data from React Query cache
    const cached = getNoteFromCache(id, userId, folderId);

    // Remove duplicates
    const list = get().recent;
    let updated = list.filter(item => item.id !== id);

    // Insert new at top
    updated.unshift({ id, title: cached.title, folderId: cached.folderId, userId });

    // Limit size (3)
    updated = updated.slice(0, 3);

    set({ recent: updated });
    // throttledSave(updated);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  loadRecent: async (userId) => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    if (!raw) return

    let list = JSON.parse(raw)

    // Only keep items belonging to this user
    list = list.filter(item => item.userId === userId)

    set({ recent: list })
  },

  clearRecent: () => {
    set({ recent: [] });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
}));

// Logs the user out

function getNoteFromCache(noteId, userId, folderId) {
  const data = queryClient.getQueryData(['notes', userId, folderId])
  if (Array.isArray(data)) {
    const item = data.find(n => n.id === noteId)
    if (item) return item
  }
  let note = queryClient.getQueryData(['note', userId, noteId]);
  return note
  // return null // TODO: Instead of returning null, refetch the note

  // --- Utility: Throttled AsyncStorage write ---
  // let saveTimeout = null

  // function throttledSave(list) {
  //   clearTimeout(saveTimeout)
  //   saveTimeout = setTimeout(() => {
  //     AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  //   }, 400) // only write after user stops navigating
}