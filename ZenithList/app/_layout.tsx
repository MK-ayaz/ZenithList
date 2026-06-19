import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSettingsStore } from "../src/stores/settingsStore";
import { initializeNotifications, setupNotificationResponseHandler } from "../src/services/notifications";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === "dark" || (theme === "system" && colorScheme === "dark");

  useEffect(() => {
    initializeNotifications();
  }, []);

  useEffect(() => {
    const sub = setupNotificationResponseHandler(() => {});
    return () => sub.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: isDark ? "#020617" : "#f8fafc" },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="task/new" options={{ presentation: "modal", headerShown: true, title: "New Task", animation: "slide_from_bottom" }} />
        <Stack.Screen name="task/[id]" options={{ headerShown: true, title: "Edit Task" }} />
        <Stack.Screen name="categories" options={{ headerShown: true, title: "Categories" }} />
        <Stack.Screen name="stats" options={{ presentation: "modal", headerShown: true, title: "Statistics", animation: "slide_from_bottom" }} />
        <Stack.Screen name="settings" options={{ headerShown: true, title: "Settings" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
