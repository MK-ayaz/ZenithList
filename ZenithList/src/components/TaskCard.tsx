import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { formatDate, getPriorityColor } from "../utils/date";
import { Task } from "../types";
import { useCategoryStore } from "../stores/categoryStore";

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onToggleComplete: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TaskCard({ task, onPress, onToggleComplete }: TaskCardProps) {
  const scale = useSharedValue(1);
  const categories = useCategoryStore((s) => s.categories);
  const category = categories.find((c) => c.id === task.categoryId);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.98); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={styles.card}
      >
        <View style={styles.row}>
          <Pressable
            onPress={onToggleComplete}
            style={[
              styles.checkbox,
              task.completedAt && styles.checkboxChecked,
            ]}
          >
            {task.completedAt && <Text style={styles.checkmark}>✓</Text>}
          </Pressable>

          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text
                style={[
                  styles.title,
                  task.completedAt && styles.titleCompleted,
                ]}
                numberOfLines={1}
              >
                {task.title}
              </Text>
              {task.priority !== "none" && (
                <View
                  style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]}
                />
              )}
            </View>

            {task.description ? (
              <Text style={styles.description} numberOfLines={2}>
                {task.description}
              </Text>
            ) : null}

            <View style={styles.meta}>
              {task.dueDate && (
                <Text style={styles.metaText}>{formatDate(task.dueDate)}</Text>
              )}
              {category && (
                <View style={styles.categoryTag}>
                  <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                  <Text style={styles.metaText}>{category.name}</Text>
                </View>
              )}
              {task.isRecurring && task.recurrenceType && (
                <Text style={styles.metaText}>{task.recurrenceType}</Text>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  row: { flexDirection: "row", alignItems: "flex-start" },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    marginRight: 12,
  },
  checkboxChecked: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  checkmark: { color: "#ffffff", fontSize: 12 },
  content: { flex: 1 },
  titleRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  title: { fontSize: 16, fontWeight: "600", color: "#111827", flex: 1 },
  titleCompleted: { color: "#9ca3af", textDecorationLine: "line-through" },
  priorityDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 8 },
  description: { fontSize: 14, color: "#6b7280", marginBottom: 4 },
  meta: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  metaText: { fontSize: 12, color: "#9ca3af", marginRight: 12 },
  categoryTag: { flexDirection: "row", alignItems: "center", marginRight: 12 },
  categoryDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
});
