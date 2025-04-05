/**
 * Code inspiration from "How To Build A Google Drive Clone With Firebase" by Web Dev Simplified.
*/
import { useEffect, useReducer } from 'react';
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
        let folder = await api.getFolder(folderId);
        dispatch({
          type: ACTIONS.UPDATE_FOLDER,
          payload: { folder }
        });
      } catch (err) {
        console.error(err);
        dispatch({
          type: ACTIONS.UPDATE_FOLDER,
          payload: { folder: ROOT_FOLDER }
        });
      }
    }
    getFolder();
  }, [folderId]);

  // set child folders
  useEffect(() => {
    const getChildFolders = async () => {
      try {
        let childFolders = await api.getFolders(folderId);
        dispatch({
          type: ACTIONS.SET_CHILD_FOLDERS,
          payload: { childFolders },
        });
      } catch (err) {
        console.error(err);
      }
    }
    getChildFolders();
  }, [folderId]);

  // set child notes
  useEffect(() => {
    const getChildNotes = async () => {
      try {
        let childNotes = await api.getNotes(folderId);
        dispatch({
          type: ACTIONS.SET_CHILD_NOTES,
          payload: { childNotes },
        });
      } catch (err) {
        console.error(err);
      }
    }
    getChildNotes();
  }, [folderId]);
  return state;
}