import api from './api';

export async function getFolderTitle(folderId) {
  try {
    let res = await api.getFolder(folderId);
    let folderTitle = res?.data?.title
    return folderTitle;
  } catch (err) {
    console.error('Could not find folder', err);
    return 'Unknown title'
  }
}