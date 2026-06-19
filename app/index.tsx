import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

import { TodoInput } from '../components/todo/TodoInput';
import { TodoList } from '../components/todo/TodoList';
import { todoService } from '../services/db';
import { Todo } from '../types/todo';


export default function Page() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const loadTodos = async () => {
    const data = await todoService.getFiltered('today');
    setTodos(data);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <View className="flex-1 px-6 pt-4">
      <TodoInput onTodoAdded={loadTodos} />
      <TodoList todos={todos} onUpdate={loadTodos} />
    </View>
  );
}
