import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styled } from 'nativewind';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, interpolate } from 'react-native-reanimated';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import { CheckCircle, Circle, Trash2 } from 'lucide-react-native';
import { Todo } from '../../types/todo';
import { todoService } from '../../services/db';

const StyledView = styled(View);
const StyledText = styled(Text);

interface TodoItemProps {
  todo: Todo;
  onUpdate: () => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onUpdate }) => {
  const translateX = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX > 100) {
        todoService.update(todo.id, { isCompleted: !todo.isCompleted }).then(onUpdate);
      } else if (event.translationX < -100) {
        todoService.delete(todo.id).then(onUpdate);
      }
      translateX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureHandlerRootView style={{ width: '100%' }}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={animatedStyle}>
          <StyledView className="flex-row items-center p-4 bg-white dark:bg-slate-900 rounded-2xl mb-3 border border-slate-100 dark:border-slate-800">
            <Pressable onPress={() => todoService.update(todo.id, { isCompleted: !todo.isCompleted }).then(onUpdate)}>
              {todo.isCompleted ? (
                <CheckCircle size={24} color="#0ea5e9" />
              ) : (
                <Circle size={24} color="#94a3b8" />
              )}
            </Pressable>
            <StyledView className="ml-3 flex-1">
              <StyledText className={`text-base font-medium ${todo.isCompleted ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                {todo.title}
              </StyledText>
              <StyledText className="text-xs text-slate-500 dark:text-slate-400">
                {todo.category} • {todo.priority} priority
              </StyledText>
            </StyledView>
          </StyledView>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};
