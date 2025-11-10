import sortMethods from './sortMethods';

const sortMethodSwitch = sortMethods // Sort methods object

/**
 * Sorts the user's notes by their chosen sort value
 * @param {String} value - Chosen sort value
 * @param {Object[]} notes - The user's notes
 * @returns {Object[]} - Sorted notes
 */
export const sortNotes = (value, notes) => {
  switch (value) {
    case '1':
      return sortMethodSwitch.sortByCreatedAsc(notes);
    case '2':
      return sortMethodSwitch.sortByCreatedDesc(notes);
    case '3':
      return sortMethodSwitch.sortByTitleDesc(notes);
    case '4':
      return sortMethodSwitch.sortByTitleAsc(notes);
    case '5':
      return sortMethodSwitch.sortByUpdatedAsc(notes);
    case '6':
      return sortMethodSwitch.sortByUpdatedDesc(notes);
    default:
      return sortMethodSwitch.sortByCreatedAsc(notes);
  }
}

/**
 * Sorts the user's folders by their chosen sort value
 * @param {String} value - Chosen sort value
 * @param {Object[]} folders - The user's folders
 * @returns {Object[]} - Sorted folders
 */
export const sortFolders = (value, folders) => {
  switch (value) {
    case '1':
      return sortMethodSwitch.sortByCreatedAsc(folders);
    case '2':
      return sortMethodSwitch.sortByCreatedDesc(folders);
    case '3':
      return sortMethodSwitch.sortByTitleDesc(folders);
    case '4':
      return sortMethodSwitch.sortByTitleAsc(folders);
    case '5':
      return sortMethodSwitch.sortByUpdatedAsc(folders);
    case '6':
      return sortMethodSwitch.sortByUpdatedDesc(folders);
    default:
      return sortMethodSwitch.sortByCreatedAsc(folders);
  }
}