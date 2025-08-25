import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddTaskModal from '../components/taskModal';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';
import { useColors } from '../contextApi/colorContext';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Feather';
import { getColors } from './colors';
export default function TasksScreen() {
  const { isDarkMode } = useColors();
  const colors = getColors(isDarkMode);
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const filters = ['All', 'Shopping', 'Chores', 'Reminders'];

  useEffect(() => {
    loadTasks();
  }, [filter, isModalVisible]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
        console.log('filteredTasks', JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleTaskSaved = () => {
    loadTasks();
    setModalVisible(false);
  };
  const handleEditTask = task => {
    loadTasks();
    setSelectedTask(task);
    setModalVisible(true);
  };

  const filteredTasks =
    filter === 'All'
      ? tasks
      : tasks.filter(
          task => task?.category?.toLowerCase() === filter?.toLowerCase(),
        );
  const saveTasks = async updated => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updated));
    } catch (error) {
      console.log('Error saving tasks:', error);
    }
  };

  // Toggle completed state
  const toggleCompleted = taskId => {
    const updated = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    );
    setTasks(updated);
    saveTasks(updated);
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Title */}
      <View style={[styles.topView, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Family Board 🏡
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={[styles.settingIcon, { color: colors.text }]}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View
        style={[
          styles.filterContainer,
          { backgroundColor: colors.card, color: colors.text },
        ]}
      >
        {filters.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.activeFilter]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.activeFilterText,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.taskCard,
              { backgroundColor: colors.card, color: colors.text },
            ]}
          >
            <CheckBox
              value={!!item.completed}
              onValueChange={() => toggleCompleted(item.id)}
              tintColors={{ true: 'black', false: 'gray' }}
            />
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text
                  style={[
                    styles.taskTitle,
                    item.completed && styles.taskTitleCompleted,
                    { color: colors.text },
                  ]}
                >
                  {item.title}
                </Text>

                {/* ✏️ Edit button */}
                <TouchableOpacity onPress={() => handleEditTask(item)}>
                  <Text style={{ fontSize: 16, color: colors.text }}>
                    <Icon name="edit" size={22} color={colors.text} />
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.taskNotes, { color: colors.itemSubtitle }]}>
                {item.notes || 'No notes'}
              </Text>
              <Text style={styles.taskCategory}>
                {item.assignee ? item.assignee : 'No assignee'}
              </Text>
              <Text style={[styles.taskDate, { color: colors.itemSubtitle }]}>
                Due:{' '}
                {item.dueDate
                  ? new Date(item.dueDate).toLocaleDateString()
                  : 'No date'}
              </Text>
            </View>
          </View>
        )}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>

      {/* Add Task Modal */}
      {isModalVisible && (
        <AddTaskModal visible={isModalVisible} onClose={handleTaskSaved} />
      )}
      {isModalVisible && (
        <AddTaskModal
          visible={isModalVisible}
          onClose={handleTaskSaved}
          taskToEdit={selectedTask}
          setSelectedTask={setSelectedTask} // 👈 pass selected task
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5faf9ff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  settingIcon: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },

  filterContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    padding: 10,
    backgroundColor: 'white',
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginRight: 8,
  },
  activeFilter: { backgroundColor: '#f17583ff' },
  filterText: { fontSize: 14 },
  activeFilterText: { color: '#fff', fontWeight: 'bold' },
  taskCard: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 8,
    flexDirection: 'row',
  },
  taskTitle: { fontSize: 16, fontWeight: 'bold' },
  taskCategory: {
    fontSize: 14,
    color: 'blue',
    backgroundColor: '#a0dcf8ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: 'flex-start', // 👈 makes width fit content
  },

  addBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#f17583ff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addText: {
    fontSize: 28,
    color: '#fff',
  },

  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  taskNotes: {
    fontSize: 14,
    color: '#555',
    marginVertical: 8,
  },

  taskDate: {
    fontSize: 13,
    color: '#555',
    marginTop: 8,
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
});
