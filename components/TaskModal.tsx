import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Plus, X } from 'lucide-react-native';
import { Task, Priority, Category } from '../types';
import { Button, Typography } from './UI';
import { nlpParseDueDate } from '../utils/dateUtils';

interface TaskModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  initialData?: Partial<Task>;
}

export const TaskModal = ({ isVisible, onClose, onSave, initialData }: TaskModalProps) => {
  const [title, setTitle] = React.useState(initialData?.title || '');
  const [description, setDescription] = React.useState(initialData?.description || '');
  const [priority, setPriority] = React.useState<Priority>(initialData?.priority || 'Medium');
  const [category, setCategory] = React.useState<Category>(initialData?.category || 'Personal');

  const handleSave = () => {
    const { dueDate, cleanedTitle } = nlpParseDueDate(title);
    onSave({ 
      title: cleanedTitle, 
      description, 
      priority, 
      category, 
      dueDate,
      isCompleted: initialData?.isCompleted || false,
      recurrence: initialData?.recurrence || 'None',
      reminderSet: initialData?.reminderSet || false
    });
    setTitle('');
    setDescription('');
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-surface-light dark:bg-surface-dark rounded-t-3xl p-6 max-h-[80%]">
          <View className="flex-row justify-between items-center mb-6">
            <Typography variant="h2">New Task</Typography>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="What needs to be done? (e.g. Buy milk tomorrow)"
            className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl text-text-light dark:text-text-dark mb-4"
            value={title}
            onChangeText={setTitle}
            autoFocus
          />

          <TextInput
            placeholder="Description (optional)"
            multiline
            className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl text-text-light dark:text-text-dark mb-4 h-24"
            value={description}
            onChangeText={setDescription}
          />

          <View className="flex-row justify-between mb-6">
            <View className="flex-1 mr-2">
              <Typography variant="caption" className="mb-2">Priority</Typography>
              <View className="flex-row gap-2">
                {(['Low', 'Medium', 'High'] as Priority[]).map(p => (
                  <TouchableOpacity 
                    key={p} 
                    onPress={() => setPriority(p)}
                    className={cn("px-3 py-1 rounded-lg border", priority === p ? "bg-primary-500 border-primary-500 text-white" : "border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark")}
                  >
                    <Text className="text-xs">{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <Button label="Create Task" onPress={handleSave} />
        </View>
      </View>
    </Modal>
  );
};

// Helper for Tailwind logic in the modal
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
