import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { light, dark } from '../styles/colors';

const ThemeContext = createContext();

const THEME_KEY = 'app-theme';

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme();
  console.log('systemTheme:', systemTheme); // dl
  const [theme, setTheme] = useState('system'); // default

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await SecureStore.getItemAsync(THEME_KEY);
        if (storedTheme) setTheme(storedTheme);
        console.log('storedTheme', storedTheme); // dl
      } catch (err) {
        console.error('Failed to load theme', err);
      }
    };
    loadTheme();
  }, []);

  /**
   * Changes the app theme on the device
   * @param {String} newTheme - 'light' | 'dark' | 'system'
   */
  const changeTheme = async (newTheme) => {
    setTheme(newTheme);
    try {
      await SecureStore.setItemAsync(THEME_KEY, newTheme);
    } catch (err) {
      console.error('Failed to store theme changes', err);
    }
  };
  let COLORS = light;

  const themeChoice = theme === 'system' ? systemTheme : theme;
  COLORS = themeChoice === 'dark' ? dark : light;
  // const COLORS = themeChoice === 'dark' ? dark : light;

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, COLORS, themeChoice }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
