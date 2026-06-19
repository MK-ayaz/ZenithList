import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme, View } from "react-native";
import * as Notifications from "expo-notifications";
import { useSettingsStore } from "../src/stores/settingsStore";
import { initializeNotifications, setupNotificationResponseHandler } from "../src/services/notifications";
import "../global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    initializeNotifications();
  }, []);

  useEffect(() => {
    const subscription = setupNotificationResponseHandler((url) => {
      // Navigation handled by expo-router deep linking
    });
    return () => subscription.remove();
  }, []);

  return (
    <>
      <StatusBar style={theme === "dark" || (theme === "system" && colorScheme === "dark") ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colorScheme === "dark" ? "#030712" : "#ffffff",
          },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="task/new"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "New Task",
          }}
        />
        <Stack.Screen
          name="task/[id]"
          options={{
            headerShown: true,
            title: "Edit Task",
          }}
        />
        <Stack.Screen
          name="categories"
          options={{
            headerShown: true,
            title: "Categories",
          }}
        />
        <Stack.Screen
          name="stats"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "Statistics",
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            headerShown: true,
            title: "Settings",
          }}
        />
      </Stack>
    </>
  );
}
