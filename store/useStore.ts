import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleNotifications: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      notificationsEnabled: true,
      setTheme: (theme) => set({ theme }),
      toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
    }),
    {
      name: 'zenith-list-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
