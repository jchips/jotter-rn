/* Folding level 4 (VS Code, cmd/ctrl + k + 4) */
import { Pressable, View, Image } from 'react-native';
import { useAppStyles } from '../styles';

export function useHeader() {
  const { app, buttons, COLORS } = useAppStyles();

  const headers = {
    dashboard: (props) => {
      const {
        setOpenGrid,
        setOpenSort,
        configSettings
      } = props;
      return (
        <View style={{ flexDirection: 'row' }}>
          {/* Grid */}
          <Pressable
            onPress={() => {
              setOpenGrid(true)
            }}
            style={styles.headerButton}
          >
            <Image
              source={{
                uri:
                  configSettings?.gridSize === '2'
                    ? `https://img.icons8.com/material-outlined/100/${COLORS.themeBtnNH}/rows.png`
                    : `https://img.icons8.com/material-outlined/100/${COLORS.themeBtnNH}/grid-2.png`,
              }}
              alt='grid-button'
              style={app.icon}
            />
          </Pressable>

          {/* Sort */}
          <Pressable
            onPress={() => {
              setOpenSort(true)
            }}
            style={styles.headerButton}
          >
            <Image
              source={{
                uri: `https://img.icons8.com/material-outlined/100/${COLORS.themeBtnNH}/sorting-arrows.png`,
              }}
              alt='sort-button'
              style={app.icon}
            />
          </Pressable>
        </View>
      )
    },
  }
  const styles = {
    headerButton: {
      ...buttons.btn1,
      backgroundColor: COLORS.background,
      margin: 0,
      paddingLeft: 0,
    },
  }
  return headers;
}
