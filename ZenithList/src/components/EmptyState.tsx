import React from "react";
import { View, Text } from "react-native";
import { cn } from "../utils/cn";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  className?: string;
}

export function EmptyState({ icon, title, description, className }: EmptyStateProps) {
  return (
    <View className={cn("flex-1 items-center justify-center px-8 py-12", className)}>
      <Text className="text-6xl mb-4">{icon}</Text>
      <Text className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
        {title}
      </Text>
      <Text className="text-gray-500 dark:text-gray-400 text-center">
        {description}
      </Text>
    </View>
  );
}
