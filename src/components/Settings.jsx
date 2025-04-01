import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
// import SelectDropdown from 'react-native-select-dropdown';
import { fetchConfigs, setConfigs } from '../reducers/configReducer';
import { useAuth } from '../contexts/AuthContext';
import api from '../util/api';
import { app, COLORS } from '../styles';

const Settings = ({ navigation }) => {
  const { data: configs } = useSelector((state) => state.configs);
  const [hideWordCount, setHideWordCount] = useState(configs?.hideWordCount);
  const { token } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchConfigs(token));
  }, [dispatch, navigation]);

  const toggleWordCountSwitch = () => {
    const hideWordCountState = hideWordCount ? false : true;
    setHideWordCount(hideWordCountState);
    const updateUserWordCount = async () => {
      let configObj = { hideWordCount: hideWordCountState };
      try {
        let res = await api.updateConfigs(configObj);
        dispatch(setConfigs({ ...res.data, ...configObj }));
      } catch (err) {
        console.error('Failed to update hide word count -', err);
      }
    };
    updateUserWordCount();
  };

  return (
    <View style={app.container}>
      <View style={styles.settingsCard}>
        <Text>Hide word count</Text>
        <Switch
          trackColor={{ false: '#767577', true: COLORS.themePurple }}
          thumbColor={hideWordCount ? COLORS.themePurpleText : '#f4f3f4'}
          ios_backgroundColor='#3e3e3e'
          onValueChange={toggleWordCountSwitch}
          value={hideWordCount}
        />
      </View>
      <View>
        {/* <SelectDropdown
          data={folderOpts}
          onSelect={(selection, index) => {
            move(selection);
          }}
          renderButton={renderButton}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  settingsCard: {
    ...app.itemCard,
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
});

export default Settings;
