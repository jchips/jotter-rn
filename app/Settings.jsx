import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  Linking,
  Pressable,
  ToastAndroid,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';
import { fetchConfigs, setConfigs } from '../src/reducers/configReducer';
import { clearRecent } from '../src/reducers/recentsReducer';
import { useAuth } from '../src/contexts/AuthContext';
import { useTheme } from '../src/contexts/ThemeContext';
import api from '../src/util/api';
import { moderateScale } from '../src/util/scaling';
import DropdownBtn from '../src/components/buttons/DropdownBtn';
import { FONTSIZE, FONT, useAppStyles } from '../src/styles';

const Settings = ({ navigation }) => {
  const { data: configs } = useSelector((state) => state.configs);
  const [hideWordCount, setHideWordCount] = useState(configs?.hideWordCount);
  const [hidePreview, setHidePreview] = useState(configs?.hidePreview);
  const [savedIndicatorColor, setSavedIndicatorColor] = useState(
    configs?.savedIndicatorColor,
  );
  const { COLORS, changeTheme, theme } = useTheme();
  const { app, MODAL, buttons } = useAppStyles();
  const { token } = useAuth();
  const dispatch = useDispatch();
  const styles = styleSheet(app, COLORS);

  useEffect(() => {
    dispatch(fetchConfigs(token));
  }, [dispatch, navigation]);

  const themes = [{ label: 'light' }, { label: 'dark' }, { label: 'system' }];
  const savedIndicatorColors = [{ label: 'theme purple' }, { label: 'red' }];

  // Theme dropdown button default text
  const dropdownBtnTextTheme = () => {
    return <Text>Select theme</Text>;
  };

  // Saved indicator color dropdown button default text
  const dropdownSavedIndicatorColor = () => {
    return <Text>Set indicator color (default: theme purple)</Text>;
  };

  // Clear recents notes (from drawer)
  const showToast = () => {
    ToastAndroid.show('Recent notes cleared.', ToastAndroid.SHORT);
  };

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
   * @param {String} selection - The selection label that is selected (optional)
   * @returns {Function} - Calls `dbUpdate()` to update settings
   */
  const updateSettings = (setting, selection) => {
    switch (setting) {
      case 'toggleWordCount':
        const hideWordCountState = hideWordCount ? false : true;
        setHideWordCount(hideWordCountState);
        return dbUpdate({ hideWordCount: hideWordCountState });
      case 'togglePreview':
        const previewState = hidePreview ? false : true;
        setHidePreview(previewState);
        return dbUpdate({ hidePreview: previewState });
      case 'savedIndicatorColor':
        const indicatorColorState =
          selection === 'theme purple' ? 'theme-purple' : 'red';
        setSavedIndicatorColor(indicatorColorState);
        return dbUpdate({ savedIndicatorColor: indicatorColorState });
    }
  };

  /**
   * Renders a theme option
   * @param {Object} item - Theme option
   * @param {Integer} index - The index of theme option in dropdown
   * @param {Boolean} isSelected - Whether the theme is selected or not
   * @returns - The theme option item
   */
  const renderItem = (item, index, isSelected) => {
    return (
      <View
        style={{
          ...MODAL.dropdownItemStyle,
          ...(isSelected && { backgroundColor: COLORS.subtle }),
        }}
      >
        <Text style={MODAL.dropdownItemTxtStyle}>{item.label}</Text>
      </View>
    );
  };

  return (
    <View style={app.container}>
      <View style={{ flex: 1 }}>
        <Text style={app.header2}>Theme</Text>
        <SelectDropdown
          data={themes}
          onSelect={(selection, index) => {
            changeTheme(selection.label);
          }}
          defaultValue={{ label: theme }}
          renderItem={renderItem}
          renderButton={(selectedItem, isOpened) =>
            DropdownBtn(
              selectedItem,
              isOpened,
              dropdownBtnTextTheme,
              false,
              '100%',
              COLORS,
            )
          }
          showsVerticalScrollIndicator={false}
          dropdownStyle={MODAL.dropdownMenuStyle}
        />

        {/* Editor settings */}
        <Text style={app.header2}>Editor</Text>
        <View style={styles.settingsCard}>
          <Text style={{ color: COLORS.text }}>Hide word count</Text>
          <Switch
            trackColor={{ false: '#767577', true: COLORS.themePurple }}
            thumbColor={hideWordCount ? COLORS.themePurpleText : '#f4f3f4'}
            ios_backgroundColor='#3e3e3e'
            onValueChange={() => updateSettings('toggleWordCount')}
            value={hideWordCount}
          />
        </View>
        <View style={styles.settingsCard}>
          <Text style={{ color: COLORS.text }}>
            Hide editor preview by default
          </Text>
          <Switch
            trackColor={{ false: '#767577', true: COLORS.themePurple }}
            thumbColor={hidePreview ? COLORS.themePurpleText : '#f4f3f4'}
            ios_backgroundColor='#3e3e3e'
            onValueChange={() => updateSettings('togglePreview')}
            value={hidePreview}
          />
        </View>
        <View style={styles.settingsCard}>
          <Text style={styles.savedIndicatorColorText}>
            Saved indicator color
          </Text>
          <SelectDropdown
            data={savedIndicatorColors}
            onSelect={(selection, index) => {
              updateSettings('savedIndicatorColor', selection.label);
            }}
            defaultValue={{ label: configs?.savedIndicatorColor }}
            renderItem={renderItem}
            renderButton={(selectedItem, isOpened) =>
              DropdownBtn(
                selectedItem,
                isOpened,
                dropdownSavedIndicatorColor,
                false,
                '100%',
                COLORS,
              )
            }
            showsVerticalScrollIndicator={false}
            dropdownStyle={MODAL.dropdownMenuStyle}
          />
        </View>

        {/* History settings */}
        <Text style={app.header2}>History</Text>
        <Pressable
          style={{ ...buttons.outlineBtn1, height: moderateScale(50) }}
          onPress={() => {
            dispatch(clearRecent());
            showToast();
          }}
        >
          <Text style={buttons.btnText2}>Clear recent notes</Text>
        </Pressable>

        {/* Web version exclusives */}
        <Text
          style={{
            ...app.smallText,
            color: COLORS.themePurpleText,
            fontFamily: FONT.semiBold,
          }}
        >
          To export notes, import notes, or delete account, log in to web.
        </Text>
      </View>
      <View style={styles.credits}>
        <Text style={styles.creditsText}>{'\u00A9'} jrotech</Text>
        <Text style={styles.creditsWrapper}>
          <Text style={[styles.creditsTextSmall]}>Icons by </Text>
          <Text
            style={[styles.creditsTextSmall, styles.link]}
            onPress={() => Linking.openURL('https://icons8.com')}
          >
            icons8
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styleSheet = (app, COLORS) =>
  StyleSheet.create({
    settingsCard: {
      ...app.itemCard,
      flex: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },
    creditsWrapper: {
      flexDirection: 'row',
    },
    credits: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    creditsText: {
      fontSize: moderateScale(FONTSIZE.xsmall),
      fontFamily: FONT.semiBold,
      marginVertical: 5,
      color: COLORS.text,
    },
    creditsTextSmall: {
      fontSize: moderateScale(FONTSIZE.xsmall),
      fontFamily: FONT.semiBold,
      color: COLORS.text,
    },
    link: {
      color: COLORS.themePurpleText,
      fontFamily: FONT.semiBold,
    },
    savedIndicatorColorText: {
      color: COLORS.text,
    },
  });

export default Settings;
