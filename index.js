/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { ColorProvider } from './contextApi/colorContext';

const AppWithProvider = () => (
  <ColorProvider>
    <App />
  </ColorProvider>
);

AppRegistry.registerComponent(appName, () => AppWithProvider);
