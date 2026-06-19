import React, { createContext, useContext } from 'react';
import { View } from 'react-native';


export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children, theme }: { children: React.ReactNode, theme: string }) => {
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => {} }}>
      <View className={`flex-1 ${theme === 'dark' ? 'dark' : ''}`}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
