import { Pressable, Image } from 'react-native';
import { useAppStyles } from '../../styles';

/**
 * Button to show/hide password text in auth forms
 * @param {Boolean} showPass - showPass state value
 * @param {()} setShowPass - function to set showPass state
 * @param {String} color - in the format: 'COLORS.textNH'
 * @returns {Component} - A Button component
 */
export default function ShowPassTextButton({ showPass, setShowPass, color }) {
  const { app } = useAppStyles();
  return (
    <Pressable
      onPress={() => setShowPass(!showPass)}
      style={{ paddingHorizontal: 5 }}
    >
      {showPass ? (
        <Image
          source={{
            uri: `https://img.icons8.com/material-outlined/100/${color}/visible--v1.png`,
          }}
          style={app.icon}
        />
      ) : (
        <Image
          source={{
            uri: `https://img.icons8.com/material-outlined/100/${color}/hide.png`,
          }}
          style={app.icon}
        />
      )}
    </Pressable>
  );
}
