import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

import { TodoList } from '../components/todo/TodoList';
import { todoService } from '../services/db';
import { Todo } from '../types/todo';


export default function Page() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const loadTodos = async () => {
    const data = await todoService.getFiltered('completed');
    setTodos(data);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <View className="flex-1 px-6 pt-4">
      <TodoList todos={todos} onUpdate={loadTodos} />
    </View>
  );
}
