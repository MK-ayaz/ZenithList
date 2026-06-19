import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { cn } from "../utils/cn";
import { formatDate, getPriorityColor } from "../utils/date";
import { Task } from "../types";
import { useCategoryStore } from "../stores/categoryStore";

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onToggleComplete: () => void;
}

export function TaskCard({ task, onPress, onToggleComplete }: TaskCardProps) {
  const scale = useSharedValue(1);
  const categories = useCategoryStore((s) => s.categories);
  const category = categories.find((c) => c.id === task.categoryId);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.98); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        className="bg-white dark:bg-gray-900 rounded-xl p-4 mb-3 shadow-sm border border-gray-100 dark:border-gray-800"
      >
        <View className="flex-row items-start">
          <Pressable
            onPress={onToggleComplete}
            className={cn(
              "w-6 h-6 rounded-full border-2 mr-3 items-center justify-center mt-0.5",
              task.completedAt
                ? "bg-primary-600 border-primary-600"
                : "border-gray-300 dark:border-gray-600"
            )}
          >
            {task.completedAt && <Text className="text-white text-xs">✓</Text>}
          </Pressable>

          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Text
                className={cn(
                  "font-semibold text-base flex-1",
                  task.completedAt
                    ? "text-gray-400 dark:text-gray-500 line-through"
                    : "text-gray-900 dark:text-white"
                )}
                numberOfLines={1}
              >
                {task.title}
              </Text>
              {task.priority !== "none" && (
                <View
                  className="w-2 h-2 rounded-full ml-2"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                />
              )}
            </View>

            {task.description ? (
              <Text
                className="text-gray-500 dark:text-gray-400 text-sm mb-1"
                numberOfLines={2}
              >
                {task.description}
              </Text>
            ) : null}

            <View className="flex-row items-center mt-1">
              {task.dueDate && (
                <Text className="text-xs text-gray-400 dark:text-gray-500 mr-3">
                  {formatDate(task.dueDate)}
                </Text>
              )}
              {category && (
                <View className="flex-row items-center mr-3">
                  <View
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: category.color }}
                  />
                  <Text className="text-xs text-gray-400 dark:text-gray-500">
                    {category.name}
                  </Text>
                </View>
              )}
              {task.isRecurring && task.recurrenceType && (
                <Text className="text-xs text-gray-400 dark:text-gray-500">
                  {task.recurrenceType}
                </Text>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
