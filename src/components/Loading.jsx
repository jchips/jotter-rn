import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Displays loading symbol while page is loading.
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

const styleSheet = (COLORS) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: COLORS.background,
    },
  });

export default Loading;
