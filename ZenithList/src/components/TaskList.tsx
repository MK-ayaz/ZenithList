import React, { useCallback } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { TaskCard } from "./TaskCard";
import { EmptyState } from "./EmptyState";
import { SwipeableRow } from "./SwipeableRow";
import { Task } from "../types";
import { useTaskStore } from "../stores/taskStore";
import * as Haptics from "expo-haptics";

interface TaskListProps {
  tasks: Task[];
  emptyIconName?: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
  emptyTitle?: string;
  emptyDescription?: string;
  onPressTask: (id: string) => void;
}

export function TaskList({
  tasks,
  emptyIconName = "clipboard-outline",
  emptyTitle = "No tasks",
  emptyDescription = "Create a new task to get started",
  onPressTask,
}: TaskListProps) {
  const completeTask = useTaskStore((s) => s.completeTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  if (tasks.length === 0) {
    return <EmptyState iconName={emptyIconName} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SwipeableRow
          onComplete={() => completeTask(item.id)}
          onDelete={() => deleteTask(item.id)}
        >
          <TaskCard
            task={item}
            onPress={() => onPressTask(item.id)}
            onToggleComplete={() => completeTask(item.id)}
          />
        </SwipeableRow>
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 120 },
});
