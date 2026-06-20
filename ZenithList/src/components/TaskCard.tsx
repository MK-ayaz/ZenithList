import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { formatDate, getPriorityColor } from "../utils/date";
import { Task } from "../types";
import { useCategoryStore } from "../stores/categoryStore";
import { Colors } from "../utils/theme";

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onToggleComplete: () => void;
  isDark?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TaskCard({ task, onPress, onToggleComplete, isDark = false }: TaskCardProps) {
  const scale = useSharedValue(1);
  const categories = useCategoryStore((s) => s.categories);
  const category = categories.find((c) => c.id === task.categoryId);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const c = isDark ? Colors.dark : Colors.light;

  const handleToggle = () => {
    Haptics.impactAsync(task.completedAt ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium);
    onToggleComplete();
  };

  const isOverdue = task.dueDate && !task.completedAt && new Date(task.dueDate) < new Date() && !task.dueDate.startsWith(new Date().toISOString().split("T")[0]);

  return (
    <AnimatedPressable style={[styles.card, { backgroundColor: c.card, borderColor: c.borderLight }, animStyle]} onPress={onPress} onPressIn={() => { scale.value = withSpring(0.98); }} onPressOut={() => { scale.value = withSpring(1); }}>
      <View style={styles.row}>
        <Pressable onPress={handleToggle} style={[styles.checkbox, { borderColor: c.border }, task.completedAt && { backgroundColor: c.primary, borderColor: c.primary }]}>
          {task.completedAt && <Ionicons name="checkmark" size={14} color={c.textInverse} />}
        </Pressable>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: c.text }, task.completedAt && { color: c.textTertiary, textDecorationLine: "line-through" }]} numberOfLines={1}>{task.title}</Text>
            {task.priority !== "none" && (
              <View style={[styles.priorityBadge, { backgroundColor: c.surface }]}>
                <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]} />
                <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>{task.priority}</Text>
              </View>
            )}
          </View>

          {task.description ? (
            <Text style={[styles.description, { color: c.textSecondary }]} numberOfLines={1}>{task.description}</Text>
          ) : null}

          <View style={styles.meta}>
            {task.dueDate && (
              <View style={[styles.metaTag, { backgroundColor: c.surface }, isOverdue && { backgroundColor: c.dangerLight }]}>
                <Ionicons name={isOverdue ? "alert-circle" : "calendar-outline"} size={12} color={isOverdue ? c.danger : c.textSecondary} />
                <Text style={[styles.metaText, { color: c.textSecondary }, isOverdue && { color: c.danger }]}>{formatDate(task.dueDate)}</Text>
              </View>
            )}
            {category && (
              <View style={[styles.metaTag, { backgroundColor: c.surface }]}>
                <View style={[styles.catDot, { backgroundColor: category.color }]} />
                <Text style={[styles.metaText, { color: c.textSecondary }]}>{category.name}</Text>
              </View>
            )}
            {task.isRecurring && task.recurrenceType && (
              <View style={[styles.metaTag, { backgroundColor: c.surface }]}>
                <Ionicons name="repeat" size={11} color={c.textSecondary} />
                <Text style={[styles.metaText, { color: c.textSecondary }]}>{task.recurrenceType}</Text>
              </View>
            )}
          </View>
        </View>

        <Ionicons name="chevron-forward" size={16} color={c.border} />
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1 },
  row: { flexDirection: "row", alignItems: "center" },
  checkbox: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, alignItems: "center", justifyContent: "center", marginRight: 14 },
  content: { flex: 1, marginRight: 4 },
  titleRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  title: { fontSize: 16, fontWeight: "600", flex: 1 },
  priorityBadge: { flexDirection: "row", alignItems: "center", marginLeft: 8, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  priorityDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  priorityText: { fontSize: 10, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  description: { fontSize: 13, marginBottom: 8 },
  meta: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 6 },
  metaTag: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, gap: 4 },
  metaText: { fontSize: 11, fontWeight: "500" },
  catDot: { width: 6, height: 6, borderRadius: 3 },
});
