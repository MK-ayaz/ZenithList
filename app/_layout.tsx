import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { styled } from 'nativewind';
import { initDb } from '../services/db';
import { useStore } from '../store/useStore';
import { ThemeProvider } from './theme-provider';

const StyledView = styled(View);

export default function RootLayout() {
  const { theme } = useStore();

  useEffect(() => {
    initDb();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <StyledView className="flex-1 bg-slate-50 dark:bg-black">
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: 'transparent' },
            headerTitleStyle: { fontWeight: 'bold', color: theme === 'dark' ? 'white' : 'black' },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="index" options={{ title: 'My Day' }} />
          <Stack.Screen name="upcoming" options={{ title: 'Upcoming' }} />
          <Stack.Screen name="completed" options={{ title: 'Archive' }} />
          <Stack.Screen name="dashboard" options={{ title: 'Insights' }} />
          <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        </Stack>
      </StyledView>
    </ThemeProvider>
  );
}
