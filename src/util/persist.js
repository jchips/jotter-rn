import * as SecureStore from 'expo-secure-store';

export const storeCurrUser = async (user) => {
  try {
    const serializedState = JSON.stringify(user);
    await SecureStore.setItemAsync('user', serializedState);
  } catch (err) {
    console.error('Failed to store user -', err);
  }
};

export const getCurrUser = async () => {
  try {
    let user = await SecureStore.getItemAsync('user');
    return user ? JSON.parse(user) : null;
  } catch (err) {
    console.error('Failed to fetch user -', err);
  }
};

export const removeCurrUser = async () => {
  try {
    await SecureStore.deleteItemAsync('user');
  } catch (err) {
    console.error('Failed to remove user -', err);
  }
};
