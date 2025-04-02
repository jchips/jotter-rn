import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchConfigs, setConfigs } from '../reducers/configReducer';
import { useAuth } from '../contexts/AuthContext';
import api from '../util/api';
import { app, COLORS } from '../styles';

const Settings = ({ navigation }) => {
  const { data: configs } = useSelector((state) => state.configs);
  const [hideWordCount, setHideWordCount] = useState(configs?.hideWordCount);
  const [hidePreview, setHidePreview] = useState(configs?.hidePreview);
  const { token } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchConfigs(token));
  }, [dispatch, navigation]);

  /**
   * Adds the new config changes to the database
   * @param {Object} updates - Updates to add to database
   */
  const dbUpdate = async (updates) => {
    try {
      let res = await api.updateConfigs(updates);
      dispatch(setConfigs({ ...res.data, ...updates }));
    } catch (err) {
      console.error('Failed to update user configs -', err);
    }
  };

  /**
   * Updates the configs based on user changes
   * @param {String} setting - The setting /config to be updated
   * @returns {Function} - Calls `dbUpdate()` to update settings
   */
  const updateSettings = (setting) => {
    switch (setting) {
      case 'toggleWordCount':
        const hideWordCountState = hideWordCount ? false : true;
        setHideWordCount(hideWordCountState);
        return dbUpdate({ hideWordCount: hideWordCountState });
      case 'togglePreview':
        const previewState = hidePreview ? false : true;
        setHidePreview(previewState);
        return dbUpdate({ hidePreview: previewState });
    }
  };

  return (
    <View style={app.container}>
      <View style={styles.settingsCard}>
        <Text>Hide word count</Text>
        <Switch
          trackColor={{ false: '#767577', true: COLORS.themePurple }}
          thumbColor={hideWordCount ? COLORS.themePurpleText : '#f4f3f4'}
          ios_backgroundColor='#3e3e3e'
          onValueChange={() => updateSettings('toggleWordCount')}
          value={hideWordCount}
        />
      </View>
      <View style={styles.settingsCard}>
        <Text>Hide editor preview by default</Text>
        <Switch
          trackColor={{ false: '#767577', true: COLORS.themePurple }}
          thumbColor={hidePreview ? COLORS.themePurpleText : '#f4f3f4'}
          ios_backgroundColor='#3e3e3e'
          onValueChange={() => updateSettings('togglePreview')}
          value={hidePreview}
        />
      </View>
      <View></View>
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
