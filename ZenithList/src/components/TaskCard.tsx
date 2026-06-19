import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handleToggle = () => {
    Haptics.impactAsync(task.completedAt ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium);
    onToggleComplete();
  };

  const isOverdue = task.dueDate && !task.completedAt && new Date(task.dueDate) < new Date() && !task.dueDate.startsWith(new Date().toISOString().split("T")[0]);

  return (
    <AnimatedPressable style={[styles.card, animStyle]} onPress={onPress} onPressIn={() => { scale.value = withSpring(0.98); }} onPressOut={() => { scale.value = withSpring(1); }}>
      <View style={styles.row}>
        <Pressable onPress={handleToggle} style={[styles.checkbox, task.completedAt && styles.checkboxChecked]}>
          {task.completedAt && <Ionicons name="checkmark" size={14} color="#fff" />}
        </Pressable>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, task.completedAt && styles.titleCompleted]} numberOfLines={1}>{task.title}</Text>
            {task.priority !== "none" && (
              <View style={styles.priorityBadge}>
                <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]} />
                <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>{task.priority}</Text>
              </View>
            )}
          </View>

          {task.description ? (
            <Text style={styles.description} numberOfLines={1}>{task.description}</Text>
          ) : null}

          <View style={styles.meta}>
            {task.dueDate && (
              <View style={[styles.metaTag, isOverdue && styles.overdueTag]}>
                <Ionicons name={isOverdue ? "alert-circle" : "calendar-outline"} size={12} color={isOverdue ? "#ef4444" : "#64748b"} />
                <Text style={[styles.metaText, isOverdue && styles.overdueText]}>{formatDate(task.dueDate)}</Text>
              </View>
            )}
            {category && (
              <View style={styles.metaTag}>
                <View style={[styles.catDot, { backgroundColor: category.color }]} />
                <Text style={styles.metaText}>{category.name}</Text>
              </View>
            )}
            {task.isRecurring && task.recurrenceType && (
              <View style={styles.metaTag}>
                <Ionicons name="repeat" size={11} color="#64748b" />
                <Text style={styles.metaText}>{task.recurrenceType}</Text>
              </View>
            )}
          </View>
        </View>

        <Ionicons name="chevron-forward" size={16} color="#e2e8f0" />
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#ffffff", borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#f1f5f9" },
  row: { flexDirection: "row", alignItems: "center" },
  checkbox: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: "#e2e8f0", alignItems: "center", justifyContent: "center", marginRight: 14 },
  checkboxChecked: { backgroundColor: "#6366f1", borderColor: "#6366f1" },
  content: { flex: 1, marginRight: 4 },
  titleRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  title: { fontSize: 16, fontWeight: "600", color: "#0f172a", flex: 1 },
  titleCompleted: { color: "#94a3b8", textDecorationLine: "line-through" },
  priorityBadge: { flexDirection: "row", alignItems: "center", marginLeft: 8, backgroundColor: "#f8fafc", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  priorityDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  priorityText: { fontSize: 10, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  description: { fontSize: 13, color: "#64748b", marginBottom: 8 },
  meta: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 6 },
  metaTag: { flexDirection: "row", alignItems: "center", backgroundColor: "#f8fafc", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, gap: 4 },
  metaText: { fontSize: 11, color: "#64748b", fontWeight: "500" },
  overdueTag: { backgroundColor: "#fef2f2" },
  overdueText: { color: "#ef4444" },
  catDot: { width: 6, height: 6, borderRadius: 3 },
});
