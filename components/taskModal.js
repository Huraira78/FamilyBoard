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
import { useColors } from '../contextApi/colorContext';
import { getColors } from '../Screens/colors';

const ITEM_HEIGHT = 44;

export default function AddTaskModal({
  visible,
  onClose,
  taskToEdit,
  setSelectedTask,
}) {
  const { isDarkMode } = useColors();
  const colors = getColors(isDarkMode);
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState([]);
  const [assignee, setAssignee] = useState(null);
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categories, setCategories] = useState([]);
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

  // const saveTask = async () => {
  //   try {
  //     const newTask = {
  //       id: Date.now(),
  //       title,
  //       notes,
  //       category: category.value,
  //       assignee: assignee ? assignee.value : null,
  //       dueDate,
  //     };

  //     const existingTasks = await AsyncStorage.getItem('tasks');
  //     let updatedTasks = [];

  //     if (existingTasks !== null) {
  //       updatedTasks = JSON.parse(existingTasks);
  //     }

  //     updatedTasks.push(newTask);

  //     await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  //     navigation.navigate('Tasks');
  //     closeModal();
  //     console.log('Task saved successfully!');
  //   } catch (error) {
  //     console.error('Error saving task:', error);
  //   }
  // };
  const saveTask = async () => {
    try {
      const existingTasks = await AsyncStorage.getItem('tasks');
      let updatedTasks = existingTasks ? JSON.parse(existingTasks) : [];

      if (taskToEdit) {
        // Update existing
        updatedTasks = updatedTasks.map(t =>
          t.id === taskToEdit.id
            ? {
                ...t,
                title,
                notes,
                category: category.value,
                assignee: assignee?.value,
                dueDate,
              }
            : t,
        );
      } else {
        // Create new
        const newTask = {
          id: Date.now(),
          title,
          notes,
          category: category.value,
          assignee: assignee?.value || null,
          dueDate,
          completed: false,
        };
        updatedTasks.push(newTask);
      }

      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      closeModal();
      navigation.navigate('Tasks');
    } catch (error) {
      console.error('Error saving/updating task:', error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setNotes('');
    setCategory({ label: 'Chores', value: 'chores' });
    setAssignee(null);
    setDueDate(new Date());
  };

  const closeModal = () => {
    onClose();
    if (setSelectedTask) setSelectedTask(null);
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
    const loadCategories = async () => {
      try {
        const stored = await AsyncStorage.getItem('categories');
        if (stored) {
          setCategories(JSON.parse(stored));
        } else {
          const categories = [
            { label: '🧹 Chores', value: 'chores' },
            { label: '🛒 Shopping', value: 'shopping' },
            { label: '⏰ Reminders', value: 'reminders' },
          ];

          setCategories(categories);
          await AsyncStorage.setItem('categories', JSON.stringify(categories));
        }
      } catch (error) {
        console.error('Error loading family members:', error);
      }
    };
    loadCategories();
    loadPeople();
  }, []);
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setNotes(taskToEdit.notes);
      setCategory({ label: taskToEdit.category, value: taskToEdit.category });
      setAssignee(
        taskToEdit.assignee
          ? { label: taskToEdit.assignee, value: taskToEdit.assignee }
          : null,
      );
      setDueDate(new Date(taskToEdit.dueDate));
    } else {
      resetForm();
    }
  }, [taskToEdit]);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={closeModal}
      animationIn="zoomIn"
      animationOut="zoomOut"
    >
      <Animated.View
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <ScrollView
          style={{ maxHeight: '100%' }}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: colors.titleText }]}>
            Add New Task
          </Text>

          {/* Title */}
          <Text style={[styles.label, { color: colors.text }]}>
            Task Title *
          </Text>
          <TextInput
            style={[
              styles.input,
              { borderColor: colors.inputBorder, color: colors.inputText },
            ]}
            placeholder="What needs to be done?"
            placeholderTextColor={
              isDarkMode ? 'rgba(255, 255, 255, 1)' : 'rgba(0,0,0,0.35)'
            }
            value={title}
            onChangeText={setTitle}
          />

          {/* Notes */}
          <Text style={[styles.label, { color: colors.text }]}>
            Notes (optional)
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                height: 74,
                borderColor: colors.inputBorder,
                color: colors.inputText,
              },
            ]}
            multiline
            placeholder="Add any additional details..."
            placeholderTextColor={
              isDarkMode ? 'rgba(255, 255, 255, 1)' : 'rgba(0,0,0,0.35)'
            }
            value={notes}
            onChangeText={setNotes}
          />

          {/* Category */}
          <Text style={[styles.label, { color: colors.text }]}>Category</Text>
          <TouchableOpacity
            style={[
              styles.dropdownHeader,
              { borderColor: colors.inputBorder, color: colors.inputText },
            ]}
            onPress={toggleCategoryList}
            activeOpacity={0.8}
          >
            <Text style={[styles.dropdownHeaderText, { color: colors.text }]}>
              {category.label ? category.label : 'No category selected'}
            </Text>
            <Text style={[styles.caret, { color: colors.text }]}>
              {isCategoryOpen ? '▴' : '▾'}
            </Text>
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
                  <Text style={[styles.itemText, { color: colors.text }]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.tick, { color: colors.text }]}>
                    {selected ? '✔' : '  '}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Animated.View>

          {/* Assign To */}
          <Text style={[styles.label, { color: colors.text }]}>
            Assign to (optional)
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdownHeader,
              {
                borderColor: colors.inputBorder,
                color: colors.inputText,
                backgroundColor: colors.card,
              },
            ]}
            onPress={toggleAssignList}
            activeOpacity={0.8}
          >
            <Text style={[styles.dropdownHeaderText, { color: colors.text }]}>
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
                  <Text style={[styles.itemText, { color: colors.text }]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.tick, { color: colors.text }]}>
                    {selected ? '✔' : '  '}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Animated.View>

          {/* Due Date */}
          <Text style={[styles.label, { color: colors.text }]}>
            Due Date 📅
          </Text>
          <TouchableOpacity
            style={[styles.input, { color: colors.text }]}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.8}
          >
            <Text style={{ color: colors.text }}>{dueDate.toDateString()}</Text>
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
              <Text style={styles.saveText}>
                {taskToEdit ? 'Update Task' : 'Save Task'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 20, borderRadius: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 14 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 10, marginBottom: 6 },
  input: {
    // backgroundColor: '#f9f9f9',
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
    // backgroundColor: '#f9f9f9',
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
    // backgroundColor: '#fff',
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
