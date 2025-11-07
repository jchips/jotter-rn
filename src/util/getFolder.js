import api from './api';

export async function getFolderTitle(folderId) {
  try {
    let res = await api.getFolder(folderId);
    let folderTitle = res?.data?.title
    console.log('folderTitle', folderTitle) // dl
    return folderTitle;
  } catch (err) {
    console.error('Could not find folder', err);
    // throw new Error('Could not find folder');
    return 'Unknown title'
  }
}