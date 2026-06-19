import React, { createContext, useContext } from 'react';
import { View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children, theme }: { children: React.ReactNode, theme: string }) => {
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => {} }}>
      <StyledView className={`flex-1 ${theme === 'dark' ? 'dark' : ''}`}>
        {children}
      </StyledView>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
