import { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useFilteredTasks } from "../../src/hooks/useFilteredTasks";
import { useTaskStore } from "../../src/stores/taskStore";
import { TaskList } from "../../src/components/TaskList";
import { FAB } from "../../src/components/FAB";

export default function InboxScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const completeTask = useTaskStore((s) => s.completeTask);
  const tasks = useFilteredTasks("inbox", searchQuery);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search inbox..."
          style={styles.searchInput}
          placeholderTextColor="#9ca3af"
        />
      </View>

      <TaskList
        tasks={tasks}
        emptyIconName="inbox"
        emptyTitle="Inbox is empty"
        emptyDescription="Tasks without a due date go here"
        onPressTask={(id) => router.push(`/task/${id}`)}
        onToggleComplete={(id) => completeTask(id)}
      />

      <FAB iconName="add" onPress={() => router.push("/task/new")} />
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
