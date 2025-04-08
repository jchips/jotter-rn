import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { extractText } from '../../util/extract';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppStyles } from '../../styles';
import { noteView } from '../../styles';

const Preview = ({ markdown }) => {
  const { COLORS } = useTheme();
  const { MARKDOWN } = useAppStyles();
  const styles = styleSheet(COLORS);
  /**
   * Flattens all the styles into one array
   * Filters out all undefined or null values
   * @param {Object[]} allStyles - All the styles on list item
   * @returns {Object[]} - All the styling with null/undefined values removed
   */
  const combineStyles = (allStyles) => {
    return allStyles.flat().filter(Boolean);
  };

  // Rules for list items (bullets, numbers, checkboxes)
  const rules = {
    list_item: (node, children, parent, style) => {
      const content = extractText(node).trim();
      const allStyles = [];

      // Match checkboxes: - [ ] or - [x]
      const checkboxMatch = content.match(/^\[( |x)\]\s*/i);
      if (checkboxMatch) {
        const isChecked = checkboxMatch[1].toLowerCase() === 'x';

        // Get styling for checkbox label
        children.forEach((child) => {
          if (child?.props?.children && Array.isArray(child?.props?.children)) {
            child.props.children.forEach((nestedChild) => {
              if (nestedChild?.props?.style) {
                allStyles.push(nestedChild.props.style);
              }
            });
          }
          if (child?.props?.style) {
            allStyles.push(child.props.style);
          }
        });
        const finalStyles = combineStyles(allStyles);
        const filteredChildren = content.replace(/^\[( |x)\]\s*/, ''); // Removes checbox
        return (
          <TouchableOpacity
            key={node.key}
            style={[noteView.checkboxContainer, style.list_item]}
          >
            <View
              style={[noteView.checkbox, isChecked && noteView.checkedCheckbox]}
            />
            <Text style={finalStyles}>{filteredChildren}</Text>
          </TouchableOpacity>
        );
      }

      // Nested bullets
      if (parent[1] && parent[1]?.sourceType === 'list_item') {
        return (
          <View
            key={node.key}
            style={[noteView.listItemContainer, style.list_item]}
          >
            <Text style={styles.innerBullet}>{'\u25E6'}</Text>
            <View>{children}</View>
          </View>
        );
      }

      // Numbered lists
      if (parent[0] && parent[0]?.sourceType === 'ordered_list') {
        let listItemNumber;
        if (parent[0]?.attributes && parent[0]?.attributes.start) {
          listItemNumber = parent[0].attributes.start + node.index;
        } else {
          listItemNumber = node.index + 1;
        }
        return (
          <View
            key={node.key}
            style={[noteView.listItemContainer, style.list_item]}
          >
            <Text style={noteView.bullet}>
              {listItemNumber}
              {node.markup}
            </Text>
            <View>{children}</View>
          </View>
        );
      }

      // Fallback for regular bullet list items (without checkboxes and not nested)
      return (
        <View
          key={node.key}
          style={[noteView.listItemContainer, style.list_item]}
        >
          <Text style={styles.bullet}>
            {Platform.select({
              android: '\u2022',
              ios: '\u00B7',
              default: '\u2022',
            })}
          </Text>
          <View>{children}</View>
        </View>
      );
    },
  };

  return (
    <ScrollView
      style={noteView.previewContainer}
      contentContainerStyle={{ paddingBottom: 20 }}
      keyboardShouldPersistTaps='handled'
    >
      <Markdown style={{ ...MARKDOWN, ...styles.markdown }} rules={rules}>
        {markdown}
      </Markdown>
    </ScrollView>
  );
};

// const styles = StyleSheet.create({
const styleSheet = (COLORS) =>
  StyleSheet.create({
    markdown: {
      height: '100%',
      width: '100%',
      paddingBottom: 20,
      whiteSpace: 'pre-wrap',
    },
    bullet: {
      ...noteView.bullet,
      color: COLORS.text,
    },
    innerBullet: {
      ...noteView.innerBullet,
      color: COLORS.text,
    },
  });

export default Preview;
