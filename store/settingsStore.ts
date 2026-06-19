import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSettings } from '../types';

interface SettingsState {
  settings: UserSettings;
  setTheme: (theme: UserSettings['theme']) => void;
  toggleNotifications: () => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: {
        theme: 'system',
        notificationsEnabled: true,
        reminderLeadTime: 15,
      },
      setTheme: (theme) => set((state) => ({ settings: { ...state.settings, theme } })),
      toggleNotifications: () => set((state) => ({ settings: { ...state.settings, notificationsEnabled: !state.settings.notificationsEnabled } })),
      updateSettings: (updates) => set((state) => ({ settings: { ...state.settings, ...updates } })),
    }),
    {
      name: 'zenith-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
