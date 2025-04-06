import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Pressable, Image, Dimensions } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchConfigs } from '../reducers/configReducer';
import { useMarkdown } from '../contexts/MDContext';
import { useAuth } from '../contexts/AuthContext';
import { useFolder } from '../hooks/useFolder';
import Loading from './Loading';
import DisplayFolders from './Display/DisplayFolders';
import DisplayNotes from './Display/DisplayNotes';
import AddButton from './Buttons/AddButton';
import Sort from './Modals/Sort';
import Grid from './Modals/Grid';
import AddTitle from './Modals/AddTitle';
import { app, buttons, COLORS } from '../styles';

const Dashboard = ({ route }) => {
  const { folderId, folderTitle } = route.params;
  const { state, refresh, loading } = useFolder(folderId);
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [error, setError] = useState('');
  const [type, setType] = useState(null);
  const [openSort, setOpenSort] = useState(false);
  const [openGrid, setOpenGrid] = useState(false);
  const [openAddTitle, setOpenAddTitle] = useState(false);
  const { token, logout } = useAuth();
  const { setMarkdown } = useMarkdown();
  const navigation = useNavigation();
  const { data } = useSelector((state) => state.configs);
  const dispatch = useDispatch();
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    dispatch(fetchConfigs(token));
  }, [dispatch]);

  useEffect(() => {
    setMarkdown('');
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        headerTitle:
          screenWidth < 440 && folderTitle.length > 20
            ? folderTitle.substring(0, 20) + '...'
            : folderTitle,
        headerRight: () => {
          return (
            <View style={{ flexDirection: 'row' }}>
              <Pressable
                onPress={() => {
                  setOpenGrid(true);
                }}
                style={styles.headerButton}
              >
                <Image
                  source={{
                    uri:
                      data?.gridSize === '2'
                        ? 'https://img.icons8.com/material-outlined/100/rows.png'
                        : 'https://img.icons8.com/material-outlined/100/grid-2.png',
                  }}
                  alt='grid-button'
                  style={app.icon}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setOpenSort(true);
                }}
                style={styles.headerButton}
              >
                <Image
                  source={{
                    uri: 'https://img.icons8.com/material-outlined/100/sorting-arrows.png',
                  }}
                  alt='sort-button'
                  style={app.icon}
                />
              </Pressable>
            </View>
          );
        },
      });
    }, [navigation, route, data])
  );

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  // logs the user out
  const logUserOut = () => {
    logout();
  };

  // Loading circle
  if (loading) {
    return <Loading />;
  }

  return !loading ? (
    <View style={styles.container}>
      {state.childFolders ? (
        <DisplayFolders
          folders={state.childFolders}
          setFolders={setFolders}
          gridSize={data?.gridSize}
          refresh={refresh}
          error={error}
        />
      ) : null}
      {state.childNotes ? (
        <DisplayNotes
          notes={state.childNotes}
          setNotes={setNotes}
          folders={state.childFolders}
          gridSize={data?.gridSize}
          refresh={refresh}
          error={error}
        />
      ) : null}
      <AddButton setOpenAddTitle={setOpenAddTitle} setType={setType} />
      <AddTitle
        openAddTitle={openAddTitle}
        setOpenAddTitle={setOpenAddTitle}
        type={type}
        notes={state.childNotes}
        setNotes={setNotes}
        folders={state.childFolders}
        refresh={refresh}
        setFolders={setFolders}
        currentFolder={state.folder}
      />
      <Sort
        openSort={openSort}
        setOpenSort={setOpenSort}
        folders={state.childFolders}
        notes={state.childNotes}
        setNotes={setNotes}
        setFolders={setFolders}
      />
      <Grid openGrid={openGrid} setOpenGrid={setOpenGrid} />
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    ...app.container,
    ...app.dashboardContainer,
  },
  headerButton: {
    ...buttons.btn1,
    backgroundColor: COLORS.themeWhite,
    margin: 0,
    paddingLeft: 0,
  },
});

export default Dashboard;
