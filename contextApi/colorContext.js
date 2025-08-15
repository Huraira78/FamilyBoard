import React, { createContext, useState, useContext } from 'react';
import { getColors } from '../Screens/colors';

const ColorContext = createContext();

export const ColorProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleColorMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ColorContext.Provider value={{ isDarkMode, toggleColorMode }}>
      {children}
    </ColorContext.Provider>
  );
};

export const useColors = () => useContext(ColorContext);
