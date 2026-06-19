import { Tabs } from "expo-router";
import { useColorScheme, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
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

  const headerRight = () => (
    <Pressable
      onPress={() => router.push("/stats")}
      style={{ marginRight: 16 }}
    >
      <MaterialIcons name="bar-chart" size={24} color={isDark ? "#fff" : "#000"} />
    </Pressable>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: isDark ? "#6b7280" : "#9ca3af",
        tabBarStyle: {
          backgroundColor: isDark ? "#111827" : "#ffffff",
          borderTopColor: isDark ? "#1f2937" : "#e5e7eb",
        },
        headerStyle: {
          backgroundColor: isDark ? "#030712" : "#ffffff",
        },
        headerTintColor: isDark ? "#ffffff" : "#000000",
        headerRight,
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: "Today",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="today" size={size} color={color} />
          ),
          tabBarBadge: todayCount > 0 ? todayCount : undefined,
        }}
      />
      <Tabs.Screen
        name="upcoming"
        options={{
          title: "Upcoming",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="date-range" size={size} color={color} />
          ),
          tabBarBadge: upcomingCount > 0 ? upcomingCount : undefined,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="inbox" size={size} color={color} />
          ),
          tabBarBadge: inboxCount > 0 ? inboxCount : undefined,
        }}
      />
      <Tabs.Screen
        name="completed"
        options={{
          title: "Done",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="check-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
