import { Tabs } from "expo-router";
import { useColorScheme, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useTaskStore } from "../../src/stores/taskStore";

function TabIcon({ icon, color }: { icon: string; color: string }) {
  return <Text style={{ fontSize: 20, color: String(color) }}>{icon}</Text>;
}

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
      <Text style={{ fontSize: 20 }}>📊</Text>
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
          tabBarIcon: ({ color }) => <TabIcon icon="📅" color={String(color)} />,
          tabBarBadge: todayCount > 0 ? todayCount : undefined,
        }}
      />
      <Tabs.Screen
        name="upcoming"
        options={{
          title: "Upcoming",
          tabBarIcon: ({ color }) => <TabIcon icon="📆" color={String(color)} />,
          tabBarBadge: upcomingCount > 0 ? upcomingCount : undefined,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          tabBarIcon: ({ color }) => <TabIcon icon="📥" color={String(color)} />,
          tabBarBadge: inboxCount > 0 ? inboxCount : undefined,
        }}
      />
      <Tabs.Screen
        name="completed"
        options={{
          title: "Done",
          tabBarIcon: ({ color }) => <TabIcon icon="✅" color={String(color)} />,
        }}
      />
    </Tabs>
  );
}
