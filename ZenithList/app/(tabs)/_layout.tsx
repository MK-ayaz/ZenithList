import { Tabs } from "expo-router";
import { View, Pressable, StyleSheet } from "react-native";
import { useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTaskStore } from "../../src/stores/taskStore";
import { useSettingsStore } from "../../src/stores/settingsStore";
import CustomTabBar from "../../src/components/CustomTabBar";
import { Colors } from "../../src/utils/theme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === "dark" || (theme === "system" && colorScheme === "dark");
  const router = useRouter();

  const getInboxTasks = useTaskStore((s) => s.getInboxTasks);
  const getTodayTasks = useTaskStore((s) => s.getTasksForToday);
  const getUpcomingTasks = useTaskStore((s) => s.getUpcomingTasks);

  const inboxCount = getInboxTasks().length;
  const todayCount = getTodayTasks().length;
  const upcomingCount = getUpcomingTasks().length;

  const colors = isDark ? Colors.dark : Colors.light;

  const headerLeft = () => (
    <Pressable onPress={() => router.push("/settings")} style={styles.headerBtnLeft} hitSlop={12}>
      <Ionicons name="settings-outline" size={22} color={colors.text} />
    </Pressable>
  );

  const headerRight = () => (
    <View style={styles.headerRightRow}>
      <Pressable onPress={() => router.push("/categories")} style={styles.headerBtnRight} hitSlop={12}>
        <Ionicons name="folder-outline" size={22} color={colors.text} />
      </Pressable>
      <Pressable onPress={() => router.push("/stats")} style={styles.headerBtnRight} hitSlop={12}>
        <Ionicons name="stats-chart" size={22} color={colors.text} />
      </Pressable>
    </View>
  );

  const tabs = [
    { key: "today" as const, label: "Today", icon: "sunny-outline" as const, activeIcon: "sunny" as const, badge: todayCount || undefined },
    { key: "upcoming" as const, label: "Upcoming", icon: "calendar-outline" as const, activeIcon: "calendar" as const, badge: upcomingCount || undefined },
    { key: "inbox" as const, label: "Inbox", icon: "mail-open-outline" as const, activeIcon: "mail-open" as const, badge: inboxCount || undefined },
    { key: "completed" as const, label: "Done", icon: "checkmark-circle-outline" as const, activeIcon: "checkmark-circle" as const },
  ];

  return (
    <Tabs
      tabBar={(props) => {
        const route = props.state.routes[props.state.index];
        return (
          <CustomTabBar
            activeTab={route.name as string as "today" | "upcoming" | "inbox" | "completed"}
            onTabPress={(key) => {
              const target = props.state.routes.find((r) => r.name === key);
              if (target) props.navigation.navigate(target.name);
            }}
            tabs={tabs}
            isDark={isDark}
          />
        );
      }}
      screenOptions={{
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: { display: "none" },
        headerStyle: {
          backgroundColor: colors.background,
          shadowColor: "transparent",
          elevation: 0,
        },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "700", fontSize: 18 },
        headerShadowVisible: false,
        headerLeft,
        headerRight,
      }}
    >
      <Tabs.Screen name="today" options={{ title: "Today" }} />
      <Tabs.Screen name="upcoming" options={{ title: "Upcoming" }} />
      <Tabs.Screen name="inbox" options={{ title: "Inbox" }} />
      <Tabs.Screen name="completed" options={{ title: "Done" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerBtnLeft: { marginLeft: 16 },
  headerBtnRight: { marginRight: 16 },
  headerRightRow: { flexDirection: "row", alignItems: "center" },
});
