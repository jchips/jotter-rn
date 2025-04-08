import './gesture-handler';
import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
// import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { MarkdownProvider } from './src/contexts/MDContext';
import Router from './src/routing/Router';
import store from './src/store';

SplashScreen.preventAutoHideAsync();
export default function App() {
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;
  Text.defaultProps.textBreakStrategy = 'simple';
  const [fontsLoaded, error] = useFonts({
    'Inter-Regular': require('./assets/fonts/Inter-Regular2.ttf'),
    'Inter-Italic': require('./assets/fonts/Inter-Italic2.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold2.ttf'),
    'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold2.ttf'),
    'Inter-ExtraBold': require('./assets/fonts/Inter-ExtraBold2.ttf'),
    'Inter-BoldItalic': require('./assets/fonts/Inter-BoldItalic2.ttf'),
    'RobotoMono-Regular': require('./assets/fonts/RobotoMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return fontsLoaded ? (
    <ThemeProvider>
      <ReduxProvider store={store}>
        <AuthProvider>
          <MarkdownProvider>
            {/* <StatusBar style='dark' /> */}
            <Router />
          </MarkdownProvider>
        </AuthProvider>
      </ReduxProvider>
    </ThemeProvider>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
