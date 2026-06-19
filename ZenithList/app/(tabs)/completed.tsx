import { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useFilteredTasks } from "../../src/hooks/useFilteredTasks";
import { useTaskStore } from "../../src/stores/taskStore";
import { TaskList } from "../../src/components/TaskList";

export default function CompletedScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const uncompleteTask = useTaskStore((s) => s.uncompleteTask);
  const tasks = useFilteredTasks("completed", searchQuery);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search completed tasks..."
          style={styles.searchInput}
          placeholderTextColor="#9ca3af"
        />
      </View>

      <TaskList
        tasks={tasks}
        emptyIcon="🎉"
        emptyTitle="No completed tasks"
        emptyDescription="Tasks you complete will show up here"
        onPressTask={(id) => router.push(`/task/${id}`)}
        onToggleComplete={(id) => uncompleteTask(id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  searchContainer: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  searchInput: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
  },
});
