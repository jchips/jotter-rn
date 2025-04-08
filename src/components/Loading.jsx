import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
// import { COLORS } from '../styles';

/**
 * Adds a loading symbol while the video is loading.
 * @returns {Component} - A component with the loading symbol
 */
const Loading = () => {
  const { COLORS } = useTheme();
  const styles = styleSheet(COLORS);
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size='large'
        color={COLORS.text}
        style={{ position: 'absolute', top: 100 }}
      />
    </View>
  );
};

// const styles = StyleSheet.create({
const styleSheet = (COLORS) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: COLORS.background,
    },
  });

export default Loading;
