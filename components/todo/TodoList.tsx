import React from 'react';
import { View } from 'react-native';
import { styled } from 'nativewind';
import { FlashList } from '@shopify/flash-list';
import { TodoItem } from './TodoItem';
import { Todo } from '../../types/todo';

const StyledView = styled(View);

interface TodoListProps {
  todos: Todo[];
  onUpdate: () => void;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, onUpdate }) => {
  return (
    <StyledView className="flex-1">
      <FlashList
        data={todos}
        renderItem={({ item }) => <TodoItem todo={item} onUpdate={onUpdate} />}
        estimatedItemSize={70}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </StyledView>
  );
};
