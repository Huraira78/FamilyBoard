import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ITEM_HEIGHT = 44;

export default function AddTaskModal({ visible, onClose }) {
  const navigation = useNavigation();
  const categories = [
    { label: '🧹 Chores', value: 'chores' },
    { label: '🛒 Shopping', value: 'shopping' },
    { label: '⏰ Reminders', value: 'reminders' },
  ];

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [assignee, setAssignee] = useState(null);
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const categoryHeight = useRef(new Animated.Value(0)).current;
  const assignHeight = useRef(new Animated.Value(0)).current;
  const [people, setPeople] = useState([]);

  const animateTo = (anim, toValue) =>
    Animated.timing(anim, {
      toValue,
      duration: 180,
      useNativeDriver: false,
    }).start();

  const toggleCategoryList = () => {
    const opening = !isCategoryOpen;
    setIsCategoryOpen(opening);
    animateTo(categoryHeight, opening ? categories.length * ITEM_HEIGHT : 0);
  };

  const toggleAssignList = () => {
    const opening = !isAssignOpen;
    setIsAssignOpen(opening);
    animateTo(assignHeight, opening ? people.length * ITEM_HEIGHT : 0);
  };

  const handleDateChange = (_e, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(Platform.OS === 'ios');
    setDueDate(currentDate);
  };

  const saveTask = async () => {
    try {
      const newTask = {
        id: Date.now(),
        title,
        notes,
        category: category.value,
        assignee: assignee ? assignee.value : null,
        dueDate,
      };

      const existingTasks = await AsyncStorage.getItem('tasks');
      let updatedTasks = [];

      if (existingTasks !== null) {
        updatedTasks = JSON.parse(existingTasks);
      }

      updatedTasks.push(newTask);

      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      navigation.navigate('Tasks');
      closeModal();
      console.log('Task saved successfully!');
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };
  const resetForm = () => {
    setTitle('');
    setNotes('');
    setCategory({ label: 'Chores', value: 'chores' }); // default category
    setAssignee(null); // or default if you want
    setDueDate(new Date());
  };

  const closeModal = () => {
    onClose();
    resetForm();
  };

  useEffect(() => {
    const loadPeople = async () => {
      try {
        const stored = await AsyncStorage.getItem('people');
        if (stored) {
          setPeople(JSON.parse(stored));
        } else {
          const defaultPeople = [
            { label: '👨 Dad', value: '👨 Dad' },
            { label: '👩 Mom', value: '👩 Mom' },
            { label: '🧒 Kids', value: '🧒 Kids' },
          ];
          setPeople(defaultPeople);
          await AsyncStorage.setItem('people', JSON.stringify(defaultPeople));
        }
      } catch (error) {
        console.error('Error loading family members:', error);
      }
    };

    loadPeople();
  }, []);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={closeModal}
      animationIn="zoomIn"
      animationOut="zoomOut"
    >
      <View style={styles.container}>
        <ScrollView
          style={{ maxHeight: '100%' }}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Add New Task</Text>

          {/* Title */}
          <Text style={styles.label}>Task Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="What needs to be done?"
            placeholderTextColor="rgba(0,0,0,0.35)"
            value={title}
            onChangeText={setTitle}
          />

          {/* Notes */}
          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, { height: 84 }]}
            multiline
            placeholder="Add any additional details..."
            placeholderTextColor="rgba(0,0,0,0.35)"
            value={notes}
            onChangeText={setNotes}
          />

          {/* Category */}
          <Text style={styles.label}>Category</Text>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={toggleCategoryList}
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownHeaderText}>{category.label}</Text>
            <Text style={styles.caret}>{isCategoryOpen ? '▴' : '▾'}</Text>
          </TouchableOpacity>
          <Animated.View
            style={{
              overflow: 'hidden',
              height: categoryHeight,
              borderRadius: 10,
            }}
          >
            {categories.map(item => {
              const selected = item.value === category.value;
              return (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.dropdownItem,
                    selected && isCategoryOpen && styles.dropdownItemSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => {
                    setCategory(item);
                    setIsCategoryOpen(false);
                    animateTo(categoryHeight, 0);
                  }}
                >
                  <Text style={styles.itemText}>{item.label}</Text>
                  <Text style={styles.tick}>{selected ? '✔' : '  '}</Text>
                </TouchableOpacity>
              );
            })}
          </Animated.View>

          {/* Assign To */}
          <Text style={styles.label}>Assign to (optional)</Text>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={toggleAssignList}
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownHeaderText}>
              {assignee ? assignee.label : 'No assignment'}
            </Text>
            <Text style={styles.caret}>{isAssignOpen ? '▴' : '▾'}</Text>
          </TouchableOpacity>
          <Animated.View
            style={{
              overflow: 'hidden',
              height: assignHeight,
              borderRadius: 10,
            }}
          >
            {/* {people.map(item => {
              const selected = !!assignee && item.value === assignee.value;
              return (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.dropdownItem,
                    selected && isAssignOpen && styles.dropdownItemSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => {
                    setAssignee(item);
                    setIsAssignOpen(false);
                    animateTo(assignHeight, 0);
                  }}
                >
                  <Text style={styles.itemText}>{item.label}</Text>
                  <Text style={styles.tick}>{selected ? '✔' : '  '}</Text>
                </TouchableOpacity>
              );
            })} */}
            {people.map(item => {
              const selected = !!assignee && item.value === assignee.value;
              return (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.dropdownItem,
                    selected && isAssignOpen && styles.dropdownItemSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => {
                    setAssignee(item);
                    setIsAssignOpen(false);
                    animateTo(assignHeight, 0);
                  }}
                >
                  <Text style={styles.itemText}>{item.label}</Text>
                  <Text style={styles.tick}>{selected ? '✔' : '  '}</Text>
                </TouchableOpacity>
              );
            })}
          </Animated.View>

          {/* Due Date */}
          <Text style={styles.label}>Due Date 📅</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.8}
          >
            <Text style={{ color: '#333' }}>{dueDate.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          {/* Actions */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveBtn,
                !title && { backgroundColor: '#f3a0aaff' },
              ]}
              onPress={() => {
                console.log('Button Pressed!');
                saveTask();
              }}
              disabled={!title}
            >
              <Text style={styles.saveText}>Save Task</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 20, borderRadius: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 14 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 10, marginBottom: 6 },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#cfcfcf',
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cfcfcf',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dropdownHeaderText: { color: '#222' },
  caret: { marginLeft: 8, color: '#777' },
  dropdownItem: {
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemSelected: {
    backgroundColor: '#f3f3f362',
  },
  tick: { width: 22, marginRight: 8, textAlign: 'center', color: 'gray' },
  itemText: { color: '#222' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelBtn: {
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelText: { color: '#555', fontWeight: '600' },
  saveBtn: {
    padding: 12,
    backgroundColor: '#f17583ff',
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: '700' },
});
