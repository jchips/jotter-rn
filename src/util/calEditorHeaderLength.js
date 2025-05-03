import { Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;

/**
 * Counts amount of times a letter occurs in a given string
 * @param {String} str - Given string
 * @param {String} letter - Letter to count
 * @returns {Number} - The amount of occurrences
 */
function countLetters(str, letter) {
  const matches = str.match(new RegExp(letter, 'gi'));
  return matches ? matches.length : 0;
}

/**
 * Modifies the note title to fit the device screen appropiately
 * @param {String} noteTitle - The note title
 * @param {Object} configs - The user's configurations
 * @returns {String} - The modified note title
 */
const calculateHeaderLength = (noteTitle, configs) => {
  const countW = countLetters(noteTitle, 'w');
  const countM = countLetters(noteTitle, 'm');

  if ( // narrow, word count, >=1 (w or m)
    (countW > 1 || countM > 1) &&
    screenWidth < 380 &&
    noteTitle.length > 7 &&
    !configs?.hideWordCount
  ) {
    return noteTitle.substring(0, 5) + '...';
  } else if ( // narrow, word count, 1 (w or m)
    (countW === 1 || countM === 1) &&
    screenWidth < 380 &&
    noteTitle.length > 7 &&
    !configs?.hideWordCount
  ) {
    return noteTitle.substring(0, 7) + '...';
  } else if ( // narrow, word count
    screenWidth < 380 &&
    noteTitle.length > 10 &&
    !configs?.hideWordCount
  ) {
    return noteTitle.substring(0, 8) + '...';
  } else if ( // narrow, no word count
    screenWidth < 380 &&
    noteTitle.length > 12 &&
    configs?.hideWordCount
  ) {
    return noteTitle.substring(0, 12) + '...'; // 10
  } else if ( // regular, word count, >=1 (w or m)
    (countW > 1 || countM > 1) &&
    screenWidth < 440 &&
    noteTitle.length > 9 &&
    !configs?.hideWordCount
  ) {
    return noteTitle.substring(0, 6) + '...';
  } else if ( // regular, word count, 1 (w or m)
    (countW === 1 || countM === 1) &&
    screenWidth < 440 &&
    noteTitle.length > 9 &&
    !configs?.hideWordCount
  ) {
    return noteTitle.substring(0, 8) + '...';
  } else if ( // regular, word count
    screenWidth < 440 &&
    noteTitle.length > 12 &&
    !configs?.hideWordCount
  ) {
    return noteTitle.substring(0, 9) + '...';
  } else if ( // regular, no word count
    screenWidth < 440 &&
    noteTitle.length > 14 &&
    configs?.hideWordCount
  ) {
    return noteTitle.substring(0, 13) + '...'; // 12
  } else { // wide
    return noteTitle;
  }
};

export default calculateHeaderLength;