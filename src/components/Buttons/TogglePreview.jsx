import { Image, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppStyles } from '../../styles';
// import { app } from '../../styles';

const TogglePreview = ({ showPreview }) => {
  const { COLORS } = useTheme();
  const { app } = useAppStyles();
  return showPreview ? (
    <Image
      source={{
        uri: `https://img.icons8.com/material-outlined/100/${COLORS.themeNoHash}/invisible.png`,
      }}
      alt='show-preview'
      style={app.icon}
    />
  ) : (
    <Image
      source={{
        uri: `https://img.icons8.com/material-outlined/100/${COLORS.themeNoHash}/visible--v1.png`,
      }}
      alt='hide-preview'
      style={app.icon}
    />
  );
};

const styles = StyleSheet.create({});

export default TogglePreview;
