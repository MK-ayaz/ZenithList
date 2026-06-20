import { useEffect, useRef } from "react";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSettingsStore } from "../src/stores/settingsStore";
import { initializeNotifications, setupNotificationResponseHandler } from "../src/services/notifications";
import { Colors } from "../src/utils/theme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === "dark" || (theme === "system" && colorScheme === "dark");
  const colors = isDark ? Colors.dark : Colors.light;
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  useEffect(() => {
    initializeNotifications();
  }, []);

  useEffect(() => {
    const sub = setupNotificationResponseHandler((url) => {
      if (url) routerRef.current.push(url as any);
    });
    return () => sub.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "slide_from_right",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "700", fontSize: 17 },
          headerShadowVisible: false,
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
