import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserSettings, ThemeMode, Priority } from "../types";

interface SettingsState extends UserSettings {
  updateTheme: (theme: ThemeMode) => void;
  updateDefaultPriority: (priority: Priority) => void;
  updateNotificationsEnabled: (enabled: boolean) => void;
  updateNotificationTime: (time: string) => void;
  updateShowCompletedTasks: (show: boolean) => void;
  updateSortBy: (sortBy: UserSettings["sortBy"]) => void;
  updateSortOrder: (sortOrder: UserSettings["sortOrder"]) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "system",
      defaultPriority: "medium",
      notificationsEnabled: true,
      notificationTime: "09:00",
      showCompletedTasks: true,
      sortBy: "dueDate",
      sortOrder: "asc",

      updateTheme: (theme) => set({ theme }),
      updateDefaultPriority: (defaultPriority) => set({ defaultPriority }),
      updateNotificationsEnabled: (notificationsEnabled) =>
        set({ notificationsEnabled }),
      updateNotificationTime: (notificationTime) => set({ notificationTime }),
      updateShowCompletedTasks: (showCompletedTasks) =>
        set({ showCompletedTasks }),
      updateSortBy: (sortBy) => set({ sortBy }),
      updateSortOrder: (sortOrder) => set({ sortOrder }),
    }),
    {
      name: "zenithlist-settings",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
