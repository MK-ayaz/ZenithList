import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CheckCircle, Circle, Trash2, Calendar, AlertCircle } from 'lucide-react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { Task } from '../types';
import { cn } from '../utils/cn';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  const priorityColors = {
    High: 'text-red-500',
    Medium: 'text-amber-500',
    Low: 'text-green-500',
  };

  return (
    <Animated.View 
      entering={FadeInRight} 
      exiting={FadeOutLeft}
      className="flex-row items-center p-4 mb-3 bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm"
    >
      <TouchableOpacity onPress={() => onToggle(task.id)} className="mr-3">
        {task.isCompleted ? (
          <CheckCircle size={24} color="#3b82f6" />
        ) : (
          <Circle size={24} color="#94a3b8" />
        )}
      </TouchableOpacity>
      
      <View className="flex-1">
        <Text className={cn("text-base font-medium", task.isCompleted && "line-through text-gray-400", "text-text-light dark:text-text-dark")}>
          {task.title}
        </Text>
        <View className="flex-row items-center mt-1">
          <Calendar size={12} color="#94a3b8" />
          <Text className="text-xs text-gray-500 ml-1">{task.dueDate.split('T')[0]}</Text>
          <View className="mx-2 w-1 h-1 bg-gray-300 rounded-full" />
          <AlertCircle size={12} color="#94a3b8" />
          <Text className={cn("text-xs ml-1", priorityColors[task.priority as keyof typeof priorityColors])}>
            {task.priority}
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => onDelete(task.id)} className="p-2">
        <Trash2 size={20} color="#ef4444" />
      </TouchableOpacity>
    </Animated.View>
  );
};
