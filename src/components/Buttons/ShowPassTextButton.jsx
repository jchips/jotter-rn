import { Pressable, Image } from 'react-native';
import { useAppStyles } from '../../styles';
import appIcons from '../../util/appIcons';

/**
 * Button to show/hide password text in auth forms
 * @param {Boolean} showPass - showPass state value
 * @param {()} setShowPass - function to set showPass state
 * @param {String} color - in the format: 'COLORS.textNH'
 * @returns {Component} - A Button component
 */
export default function ShowPassTextButton({ showPass, setShowPass }) {
  const { app, COLORS } = useAppStyles();
  const icons = appIcons(COLORS);
  return (
    <Pressable
      onPress={() => setShowPass(!showPass)}
      style={{ paddingHorizontal: 5 }}
    >
      {showPass ? (
        <Image
          source={{
            uri: icons.show,
          }}
          style={app.icon}
        />
      ) : (
        <Image
          source={{
            uri: icons.hide,
          }}
          style={app.icon}
        />
      )}
    </Pressable>
  );
}
