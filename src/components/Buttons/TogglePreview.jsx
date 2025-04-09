import { Image, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppStyles } from '../../styles';

const TogglePreview = ({ showPreview }) => {
  const { COLORS } = useTheme();
  const { app } = useAppStyles();
  return showPreview ? (
    <Image
      source={{
        uri: `https://img.icons8.com/material-outlined/100/${COLORS.themeBtnNH}/invisible.png`,
      }}
      alt='show-preview'
      style={app.icon}
    />
  ) : (
    <Image
      source={{
        uri: `https://img.icons8.com/material-outlined/100/${COLORS.themeBtnNH}/visible--v1.png`,
      }}
      alt='hide-preview'
      style={app.icon}
    />
  );
};

const styles = StyleSheet.create({});

export default TogglePreview;
