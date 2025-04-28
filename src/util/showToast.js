import { ToastAndroid, Platform } from 'react-native';

/**
 * Displays a brief Toast on Android phones.
 * @param {String} message - The message to be displayed in the Toast.
 */
const showToast = (message) => {
  Platform.OS === 'android' ?
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    ) : null;
}

export default showToast;