import { useState } from "react";
import { View, TextInput, Text, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useFilteredTasks } from "../../src/hooks/useFilteredTasks";
import { useTaskStore } from "../../src/stores/taskStore";
import { TaskList } from "../../src/components/TaskList";
import { FAB } from "../../src/components/FAB";

export default function TodayScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const completeTask = useTaskStore((s) => s.completeTask);
  const tasks = useFilteredTasks("today", searchQuery);

  return (
    <View className="flex-1 bg-white dark:bg-gray-950">
      <View className="px-4 pt-2 pb-3">
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search today's tasks..."
          className="bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white"
          placeholderTextColor="#9ca3af"
        />
      </View>

      <TaskList
        tasks={tasks}
        emptyIcon="☀️"
        emptyTitle="All clear today"
        emptyDescription="No tasks due today. Enjoy your day!"
        onPressTask={(id) => router.push(`/task/${id}`)}
        onToggleComplete={(id) => completeTask(id)}
      />

      <FAB icon="+" onPress={() => router.push("/task/new")} />
    </View>
  );
}
