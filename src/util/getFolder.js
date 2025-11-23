import api from './api';

export async function getFolderTitle(folderId) {
  try {
    let res = await api.getFolder(folderId);
    let folderTitle = res?.data?.title;
    let folderParentId = res?.data?.parentId;
    return { title: folderTitle, parentId: folderParentId }
  } catch (err) {
    console.error('Could not find folder', err);
    return { title: 'Unknown title', parentId: null }
  }
}