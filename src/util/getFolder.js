import api from './api';

export async function getFolderTitle(folderId) {
  try {
    let res = await api.getFolder(folderId);
    let folderTitle = res?.data?.title
    return folderTitle;
  } catch (err) {
    console.error(err);
    throw new Error('Could not find folder');
  }
}