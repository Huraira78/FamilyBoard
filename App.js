import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './Screens/HomeScreen';
import TasksScreen from './Screens/TasksScreen';
import SettingScreen from './Screens/SettingScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkTasks = async () => {
      try {
        const tasks = await AsyncStorage.getItem('tasks');
        if (tasks && JSON.parse(tasks).length > 0) {
          setInitialRoute('Tasks');
        } else {
          setInitialRoute('Home');
        }
      } catch (error) {
        console.error('Error checking tasks:', error);
        setInitialRoute('Home');
      }
    };

    checkTasks();
  }, []);

  if (!initialRoute) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={initialRoute}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Tasks" component={TasksScreen} />
        <Stack.Screen name="Settings" component={SettingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
