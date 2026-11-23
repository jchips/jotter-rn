import { Image, StyleSheet } from 'react-native';
import { useAppStyles } from '../../styles';
import appIcons from '../../util/appIcons';

const TogglePreview = ({ showPreview }) => {
  const { app, COLORS } = useAppStyles();
  const icons = appIcons(COLORS);
  return showPreview ? (
    <Image
      source={{
        uri: icons.hide,
      }}
      alt='show-preview'
      style={app.icon}
    />
  ) : (
    <Image
      source={{
        uri: icons.show,
      }}
      alt='hide-preview'
      style={app.icon}
    />
  );
};

const styles = StyleSheet.create({});

export default TogglePreview;
