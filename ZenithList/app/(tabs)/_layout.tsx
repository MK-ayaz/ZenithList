import { Tabs } from "expo-router";
import { useColorScheme, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTaskStore } from "../../src/stores/taskStore";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const getInboxTasks = useTaskStore((s) => s.getInboxTasks);
  const getTodayTasks = useTaskStore((s) => s.getTasksForToday);
  const getUpcomingTasks = useTaskStore((s) => s.getUpcomingTasks);

  const inboxCount = getInboxTasks().length;
  const todayCount = getTodayTasks().length;
  const upcomingCount = getUpcomingTasks().length;

  const activeColor = "#6366f1";
  const inactiveColor = isDark ? "#64748b" : "#94a3b8";

  const headerRight = () => (
    <Pressable onPress={() => router.push("/stats")} style={styles.headerBtn}>
      <Ionicons name="stats-chart" size={22} color={isDark ? "#f8fafc" : "#0f172a"} />
    </Pressable>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: isDark ? "#0f172a" : "#ffffff",
          borderTopColor: isDark ? "#1e293b" : "#f1f5f9",
          borderTopWidth: 1,
          height: 88,
          paddingTop: 8,
          paddingBottom: 28,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        headerStyle: { backgroundColor: isDark ? "#020617" : "#ffffff", shadowColor: "transparent", elevation: 0 },
        headerTintColor: isDark ? "#f8fafc" : "#0f172a",
        headerTitleStyle: { fontWeight: "700", fontSize: 18 },
        headerShadowVisible: false,
        headerRight,
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: "Today",
          tabBarIcon: ({ color, size }) => <Ionicons name="sunny" size={size} color={color} />,
          tabBarBadge: todayCount || undefined,
          tabBarBadgeStyle: { backgroundColor: activeColor, fontSize: 10, fontWeight: "700" },
        }}
      />
      <Tabs.Screen
        name="upcoming"
        options={{
          title: "Upcoming",
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
          tabBarBadge: upcomingCount || undefined,
          tabBarBadgeStyle: { backgroundColor: activeColor, fontSize: 10, fontWeight: "700" },
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          tabBarIcon: ({ color, size }) => <Ionicons name="mail-open" size={size} color={color} />,
          tabBarBadge: inboxCount || undefined,
          tabBarBadgeStyle: { backgroundColor: activeColor, fontSize: 10, fontWeight: "700" },
        }}
      />
      <Tabs.Screen
        name="completed"
        options={{
          title: "Done",
          tabBarIcon: ({ color, size }) => <Ionicons name="checkmark-circle" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerBtn: { marginRight: 16 },
});
