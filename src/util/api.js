import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL;

const api = axios.create({
  baseURL: `${API_URL}/jotter`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

let getToken;
let logoutHandler = null;

/**
 * Sets the Bearer auth token to the current user's token.
 * @param {Function} tokenGetter - Returns the current user's token.
 */
const setTokenGetter = (tokenGetter) => {
  getToken = tokenGetter;
};

/**
 * Fetches logout() from useAuth hook
 * @param {Function} handler - Returns the logout function.
 */
const setLogoutHandler = (handler) => {
  logoutHandler = handler;
}

// api (axios) interceptor for fetching jwt
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

// api (axios) interceptor for auto logout on errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;

    if (status === 401 && logoutHandler) {
      await logoutHandler();
    }

    return Promise.reject(error)
  }
)

const apiService = {
  setTokenGetter,
  setLogoutHandler,
  authenticate: () => api.get('/', { withCredentials: true }),
  getNote: (noteId) => api.get(`/note/${noteId}`),
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
  updateUser: (body, userId) => api.patch(`/update/${userId}`, body)
}

export default apiService;