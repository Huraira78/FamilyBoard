import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useColors } from '../contextApi/colorContext';
import { getColors } from './colors';
const DEFAULT_PEOPLE = [
  { label: '👨 Dad', value: '👨 Dad' },
  { label: '👩 Mom', value: '👩 Mom' },
  { label: '🧒 Kids', value: '🧒 Kids' },
];

const EMOJI_OPTIONS = ['👨', '👩', '🧒', '👵', '👴', '🐶', '🐱'];

export default function SettingsScreen({ navigation }) {
  const { isDarkMode, toggleColorMode } = useColors();
  const colors = getColors(isDarkMode);
  const [people, setPeople] = useState([]);
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [adding, setAdding] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSwitch = () => setDarkMode(previousState => !previousState);

  useEffect(() => {
    const loadPeople = async () => {
      const stored = await AsyncStorage.getItem('people');
      if (stored) {
        setPeople(JSON.parse(stored));
      } else {
        await AsyncStorage.setItem('people', JSON.stringify(DEFAULT_PEOPLE));
        setPeople(DEFAULT_PEOPLE);
      }
    };
    loadPeople();
  }, []);

  // Save to AsyncStorage
  const savePeople = async updated => {
    setPeople(updated);
    await AsyncStorage.setItem('people', JSON.stringify(updated));
  };

  // Add new person
  const handleAdd = () => {
    if (!name.trim() || !selectedEmoji) return;
    const newPerson = {
      label: `${selectedEmoji} ${name.trim()}`,
      value: `${selectedEmoji} ${name.trim()}`,
    };
    const updated = [...people, newPerson];
    savePeople(updated);
    setName('');
    setSelectedEmoji('');
    setAdding(false);
  };

  // Delete person
  const handleDelete = index => {
    const updated = people.filter((_, i) => i !== index);
    savePeople(updated);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Settings
        </Text>
      </View>
      <View style={[styles.familyView, { backgroundColor: colors.card }]}>
        {/* Add button */}
        {!adding && (
          <View
            style={[
              styles.addRow,

              {
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.familyText, { color: colors.text }]}>
              👨‍👩‍👧 Family Members
            </Text>
            <TouchableOpacity onPress={() => setAdding(true)}>
              <Text style={[styles.plusIcon, { color: colors.text }]}>+</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Add form */}
        {adding && (
          <View style={[styles.addForm, { backgroundColor: colors.card }]}>
            <Text style={{ color: colors.text }}>Name</Text>
            <TextInput
              t
              style={[
                styles.input,
                { color: colors.text, borderColor: colors.border },
              ]}
              placeholder="Enter name"
              value={name}
              onChangeText={setName}
              placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
            />
            <Text style={{ color: colors.text }}>Avatar</Text>
            <View style={styles.emojiRow}>
              {EMOJI_OPTIONS.map(emoji => (
                <TouchableOpacity
                  key={emoji}
                  style={[
                    styles.emojiButton,
                    selectedEmoji === emoji && styles.selectedEmoji,
                  ]}
                  onPress={() => setSelectedEmoji(emoji)}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.formButtons}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleAdd}
                disabled={!name}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setAdding(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* List */}
        <FlatList
          data={people}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.personRow,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.personText, { color: colors.text }]}>
                {item.label}
              </Text>
              <TouchableOpacity onPress={() => handleDelete(index)}>
                <Text style={styles.deleteIcon}>
                  <Icon name="trash-outline" size={24} color="red" />
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <View style={[styles.container1, { backgroundColor: colors.card }]}>
        <Text style={[styles.header1, { color: colors.text }]}>Appearance</Text>
        <View style={styles.row}>
          <Icon
            name="moon"
            size={22}
            color={isDarkMode ? '#FFD700' : '#555'}
            style={styles.icon}
          />
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              Dark Mode
            </Text>
            <Text style={[styles.subtitle, { color: colors.text }]}>
              {isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleColorMode}
            trackColor={{ false: '#ccc', true: '#4a90e2' }}
            thumbColor={isDarkMode ? '#fff' : '#000'}
          />
        </View>
      </View>
      <View style={styles.container2}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About
          </Text>

          <View style={styles.itemRow}>
            <Icon
              name="information-circle-outline"
              size={20}
              color={colors.text}
            />
            <View style={styles.itemText}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>
                About App
              </Text>
              <Text style={[styles.itemSubtitle, { color: colors.text }]}>
                Version 1.0.0 • Family Board
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Text style={[styles.footerText, { color: colors.text }]}>
          Made with <Text style={styles.heart}>❤️</Text> for families everywhere
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5faf9ff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'white',
    padding: 10,
  },
  familyView: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    elevation: 2, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backArrow: { fontSize: 24, marginRight: 10 },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    // marginTop: 5,
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  addButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  addForm: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginVertical: 5,
  },
  familyText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  plusIcon: {
    fontSize: 22,
    color: 'green',
  },

  emojiRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  emojiButton: {
    padding: 5,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  selectedEmoji: { borderColor: 'green', borderWidth: 2 },
  emojiText: { fontSize: 22 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
    color: 'black',
  },
  formButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  button: { flex: 1, padding: 10, borderRadius: 5, marginHorizontal: 5 },
  saveButton: { backgroundColor: '#f17583ff' },
  cancelButton: { backgroundColor: '#cacacaff', color: 'black' },
  buttonText: { color: '#fff', textAlign: 'center' },
  personRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  personText: { fontSize: 16 },
  deleteIcon: { fontSize: 16, color: 'black' },
  container1: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    elevation: 2, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header1: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
  },
  container2: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  card: {
    // backgroundColor: ,
    width: '100%',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#111827',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    marginLeft: 10,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  footerText: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 12,
  },
  heart: {
    color: 'red',
  },
});
