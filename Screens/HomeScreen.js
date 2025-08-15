import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import AddTaskModal from '../components/taskModal';
import { useColors } from '../contextApi/colorContext';
import { getColors } from './colors';
const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]); // Empty at first
  const [modalVisible, setModalVisible] = useState(false);
  const { isDarkMode } = useColors();
  const colors = getColors(isDarkMode);
  if (tasks.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          Family Board 🏡
        </Text>

        {/* Center Family Icon */}
        <LinearGradient
          colors={['#cfe8ff', '#e6ffcc']} // blue-100 to green-100 equivalent
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconWrapper}
        >
          <Text style={styles.familyIcon}>👨‍👩‍👧‍👦</Text>
        </LinearGradient>

        {/* No tasks message */}
        <Text style={[styles.noTaskTitle, { color: colors.text }]}>
          No tasks yet!
        </Text>
        <Text style={[styles.noTaskSubtitle, { color: colors.text }]}>
          Add your first task to get your family organized and working together.
        </Text>

        {/* Add Task Button */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addBtnText}>＋ Add Your First Task</Text>
        </TouchableOpacity>
        <AddTaskModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </SafeAreaView>
    );
  }

  // Later: Show task list here when tasks are added
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f7fdfd',
  },
  title: {
    fontSize: width * 0.07, // Responsive
    fontWeight: '700',
    marginVertical: 20,
    color: '#333',
  },
  iconWrapper: {
    width: width * 0.4,
    height: width * 0.4,
    backgroundColor: '#e0f7f3',
    borderRadius: width * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  familyIcon: {
    fontSize: 50, // adjust for desired size
    textAlign: 'center',
  },

  icon: {
    width: '60%',
    height: '60%',
  },
  noTaskTitle: {
    fontSize: width * 0.06,
    fontWeight: '700',
    marginTop: 10,
    color: '#333',
  },
  noTaskSubtitle: {
    fontSize: width * 0.04,
    color: '#555',
    textAlign: 'center',
    marginTop: 8,
    width: '80%',
  },
  addBtn: {
    marginTop: 20,
    backgroundColor: '#ff6f61',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  addBtnText: {
    fontSize: width * 0.045,
    color: '#fff',
    fontWeight: '600',
  },
});
