import React from "react";
import { FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { TaskCard } from "./TaskCard";
import { EmptyState } from "./EmptyState";
import { Task } from "../types";

interface TaskListProps {
  tasks: Task[];
  emptyIconName?: keyof typeof MaterialIcons.glyphMap;
  emptyTitle?: string;
  emptyDescription?: string;
  onPressTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export function TaskList({
  tasks,
  emptyIconName = "checklist",
  emptyTitle = "No tasks",
  emptyDescription = "Create a new task to get started",
  onPressTask,
  onToggleComplete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        iconName={emptyIconName}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TaskCard
          task={item}
          onPress={() => onPressTask(item.id)}
          onToggleComplete={() => onToggleComplete(item.id)}
        />
      )}
      contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    />
  );
}
