import { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFilteredTasks } from "../../src/hooks/useFilteredTasks";
import { useTaskStore } from "../../src/stores/taskStore";
import { TaskList } from "../../src/components/TaskList";

export default function CompletedScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const tasks = useFilteredTasks("completed", searchQuery);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#94a3b8" />
          <TextInput value={searchQuery} onChangeText={setSearchQuery} placeholder="Search completed..." style={styles.searchInput} placeholderTextColor="#94a3b8" />
          {searchQuery.length > 0 && (
            <Ionicons name="close-circle" size={18} color="#94a3b8" onPress={() => setSearchQuery("")} />
          )}
        </View>
      </View>
      <TaskList
        tasks={tasks}
        emptyIconName="checkmark-done-circle"
        emptyTitle="No completed tasks"
        emptyDescription="Tasks you complete will show up here"
        onPressTask={(id) => router.push(`/task/${id}`)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  searchContainer: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#ffffff", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: "#e2e8f0", gap: 10 },
  searchInput: { flex: 1, fontSize: 15, color: "#0f172a", padding: 0 },
});
