/**
 * Code inspiration from "How To Build A Google Drive Clone With Firebase" by Web Dev Simplified.
*/
import { useEffect, useState, useReducer } from 'react';
import api from '../util/api';

const ACTIONS = {
  SELECT_FOLDER: 'select-folder',
  UPDATE_FOLDER: 'update-folder',
  SET_CHILD_FOLDERS: 'set-child-folders',
  SET_CHILD_NOTES: 'set-child-notes'
};

export const ROOT_FOLDER = { title: 'Home', id: null, path: [] };

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.SELECT_FOLDER:
      return {
        folderId: payload.folderId,
        folder: payload.folder,
        childFolders: [],
        childNotes: []
      }
    case ACTIONS.UPDATE_FOLDER:
      return {
        ...state,
        folder: payload.folder
      }
    case ACTIONS.SET_CHILD_FOLDERS:
      return {
        ...state,
        childFolders: payload.childFolders
      }
    case ACTIONS.SET_CHILD_NOTES:
      return {
        ...state,
        childNotes: payload.childNotes
      }
    default:
      return state;
  }
}

// Defaults parameters to null instead of undefined
export function useFolder(folderId = null, folder = null) {
  const [state, dispatch] = useReducer(reducer, {
    folderId: folderId,
    folder: folder,
    childFolders: [],
    childNotes: []
  });

  const [loading, setLoading] = useState(true);

  // resets folder for breadcrumb
  useEffect(() => {
    dispatch({
      type: ACTIONS.SELECT_FOLDER,
      payload: { folderId, folder }
    });
  }, [folderId, folder]);

  // updates folder with it's data from database
  useEffect(() => {
    if (folderId === 'null' || folderId === null) { // in the root folder
      return dispatch({
        type: ACTIONS.UPDATE_FOLDER,
        payload: { folder: ROOT_FOLDER }
      });
    }

    // If there's an error getting the current folder, update the root instead
    const getFolder = async () => {
      try {
        setLoading(true);
        let folder = await api.getFolder(folderId);
        folderData = folder.data
        dispatch({
          type: ACTIONS.UPDATE_FOLDER,
          payload: { folder: folderData }
        });
      } catch (err) {
        console.error(err);
        dispatch({
          type: ACTIONS.UPDATE_FOLDER,
          payload: { folder: ROOT_FOLDER }
        });
      }
      setLoading(false);
    }
    getFolder();
  }, [folderId]);

  const getChildFolders = async () => {
    try {
      setLoading(true);
      let childFolders = await api.getFolders(folderId);
      let folders = childFolders.data;
      dispatch({
        type: ACTIONS.SET_CHILD_FOLDERS,
        payload: { childFolders: folders },
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const getChildNotes = async () => {
    try {
      setLoading(true);
      let childNotes = await api.getNotes(folderId);
      let notes = childNotes.data;
      dispatch({
        type: ACTIONS.SET_CHILD_NOTES,
        payload: { childNotes: notes },
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const refresh = async () => {
    await Promise.all([getChildFolders(), getChildNotes()]);
  };

  useEffect(() => {
    refresh(); // fetch both on mount/folderId change
  }, [folderId, folder]);

  return { state, refresh, loading };
}