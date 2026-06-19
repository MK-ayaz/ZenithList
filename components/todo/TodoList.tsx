import React from 'react';
import { View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { TodoItem } from './TodoItem';
import { Todo } from '../../types/todo';

interface TodoListProps {
  todos: Todo[];
  onUpdate: () => void;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, onUpdate }) => {
  return (
    <View className="flex-1">
      <FlashList
        data={todos}
        renderItem={({ item }) => <TodoItem todo={item} onUpdate={onUpdate} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};
