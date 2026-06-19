import React, { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';

import { Plus } from 'lucide-react-native';
import { parseNaturalLanguageDate, extractTodoTitle } from '../../utils/nlp';
import { todoService } from '../../services/db';
import { notificationService } from '../../services/notifications';
import { useStore } from '../../store/useStore';



interface TodoInputProps {
  onTodoAdded: () => void;
}

export const TodoInput: React.FC<TodoInputProps> = ({ onTodoAdded }) => {
  const [text, setText] = useState('');
  const { notificationsEnabled } = useStore();

  const handleAddTodo = async () => {
    if (!text.trim()) return;

    const { date, text: dateText } = parseNaturalLanguageDate(text);
    const title = extractTodoTitle(text);

    const newTodo = {
      title,
      description: '',
      dueDate: date.toISOString(),
      priority: 'medium',
      category: 'Other',
      isCompleted: false,
      createdAt: new Date().toISOString(),
      reminderScheduled: false,
    };

    const id = await todoService.create(newTodo);
    
    if (notificationsEnabled) {
      await notificationService.requestPermissions();
      await notificationService.scheduleReminder(id, title, date);
    }

    setText('');
    onTodoAdded();
  };

  return (
    <View className="flex-row items-center p-2 bg-slate-100 dark:bg-slate-900 rounded-3xl mb-6 shadow-sm">
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Add a task... (e.g. Buy milk tomorrow)"
        className="flex-1 px-4 py-2 text-slate-900 dark:text-slate-100"
        placeholderTextColor="#94a3b8"
      />
      <Pressable onPress={handleAddTodo} className="p-2 bg-primary-500 rounded-full">
        <Plus size={24} color="white" />
      </Pressable>
    </View>
  );
};
