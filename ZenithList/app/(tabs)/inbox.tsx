import { useState } from "react";
import { View, TextInput, useColorScheme, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFilteredTasks } from "../../src/hooks/useFilteredTasks";
import { useSettingsStore } from "../../src/stores/settingsStore";
import { TaskList } from "../../src/components/TaskList";
import { FAB } from "../../src/components/FAB";
import { Colors } from "../../src/utils/theme";

export default function InboxScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === "dark" || (theme === "system" && colorScheme === "dark");
  const c = isDark ? Colors.dark : Colors.light;
  const tasks = useFilteredTasks("inbox", searchQuery);

  return (
    <View style={[styles.container, { backgroundColor: c.surface }]}>
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: c.card, borderColor: c.border }]}>
          <Ionicons name="search" size={18} color={c.textTertiary} />
          <TextInput value={searchQuery} onChangeText={setSearchQuery} placeholder="Search tasks..." style={[styles.searchInput, { color: c.text }]} placeholderTextColor={c.textTertiary} />
          {searchQuery.length > 0 && (
            <Ionicons name="close-circle" size={18} color={c.textTertiary} onPress={() => setSearchQuery("")} />
          )}
        </View>
      </View>
      <TaskList
        tasks={tasks}
        emptyIconName="mail-open"
        emptyTitle="Inbox is empty"
        emptyDescription="Tasks without a due date go here"
        onPressTask={(id) => router.push(`/task/${id}`)}
        isDark={isDark}
      />
      <FAB iconName="add" onPress={() => router.push("/task/new")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  searchBar: { flexDirection: "row", alignItems: "center", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, gap: 10 },
  searchInput: { flex: 1, fontSize: 15, padding: 0 },
});
