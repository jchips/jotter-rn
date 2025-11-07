import './gesture-handler';
import React, { useEffect } from 'react';
import { StyleSheet, Text, Platform } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { MarkdownProvider } from './src/contexts/MDContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Router from './src/routing/Router';
import store from './src/store';

SplashScreen.setOptions({
  duration: 200,
  fade: true,
});

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
            {/* TODO: Move <SafeAreaProvider> outside of android 15+ router */}
            <SafeAreaProvider>
              {Platform.OS === 'android' && Platform.Version <= 33 ? (
                <SafeAreaView style={{ flex: 1 }}>
                  <Router />
                </SafeAreaView>
              ) :
                <Router />}
            </SafeAreaProvider>
          </MarkdownProvider>
        </AuthProvider>
      </ReduxProvider>
    </ThemeProvider>
  ) : null;
}

const styles = StyleSheet.create({});
