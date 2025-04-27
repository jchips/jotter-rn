import axios from 'axios';
import { API_URL } from '@env';

const api = axios.create({
  baseURL: `${API_URL}/jotter`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

let getToken;

/**
 * Sets the Bearer auth token to the current user's token.
 * @param {Function} tokenGetter - Returns the current user's token.
 */
const setTokenGetter = (tokenGetter) => {
  getToken = tokenGetter;
};

// Axios interceptor
api.interceptors.request.use(
  (apiConfig) => {
    const token = getToken();
    if (token) {
      apiConfig.headers['Authorization'] = `Bearer ${token}`;
      apiConfig.withCredentials = true;
    }
    return apiConfig;
  }
);

const apiService = {
  setTokenGetter,
  authenticate: () => api.get('/', { withCredentials: true }),
  getRootNotes: () => api.get('/note'),
  getNotes: (folderId) => api.get(`/note/f/${folderId}`),
  addNote: (body) => api.post('/note', body),
  updateNote: (body, noteId) => api.patch(`/note/${noteId}`, body),
  deleteNote: (noteId) => api.delete(`/note/${noteId}`),
  getFolder: (folderId) => api.get(`/folder/${folderId}`),
  getFolders: (parentId) => api.get(`/folder/f/${parentId}`),
  getAllFolders: (folderId, type) => api.get(`/folder/all/${type}/${folderId}`),
  addFolder: (body) => api.post('/folder', body),
  updateFolder: (body, folderId) => api.patch(`/folder/${folderId}`, body),
  deleteFolder: (folderId) => api.delete(`/folder/${folderId}`),
  getConfigs: () => api.get('/config'),
  updateConfigs: (body) => api.patch('/config', body),
  updateUser: (body, userId) => api.patch(`/update/${userId}`, body),
  deleteUser: (userId) => api.delete(`/delete/${userId}`),
}

export default apiService;