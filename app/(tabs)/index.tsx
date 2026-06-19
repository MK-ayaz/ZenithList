import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Plus, Search } from 'lucide-react-native';
import { FlashList } from '@shopify/flash-list';
import { dbService } from '../../services/db';
import { TaskItem } from '../../components/TaskItem';
import { TaskModal } from '../../components/TaskModal';
import { Typography, Button } from '../../components/UI';
import { Task } from '../../types';

export default function InboxScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadTasks();
  }, [search]);

  async function loadTasks() {
    setLoading(true);
    const data = await dbService.getTasks('all', search);
    setTasks(data);
    setLoading(false);
  }

  async function handleToggle(id: number) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    await dbService.updateTask(id, { isCompleted: !task.isCompleted });
    await loadTasks();
  }

  async function handleDelete(id: number) {
    await dbService.deleteTask(id);
    await loadTasks();
  }

  async function handleAddTask(taskData: any) {
    await dbService.addTask({
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setModalVisible(false);
    await loadTasks();
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background-light dark:bg-background-dark">
        <ActivityIndicator color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark px-4 pt-12">
      <View className="flex-row justify-between items-center mb-6">
        <Typography variant="h1">Inbox</Typography>
        <TouchableOpacity 
          onPress={() => setModalVisible(true)}
          className="bg-primary-500 p-3 rounded-full shadow-lg"
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded-xl mb-6">
        <Search size={20} color="#64748b" />
        <TextInput 
          className="flex-1 ml-2 text-text-light dark:text-text-dark"
          placeholder="Search tasks..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlashList
        data={tasks}
        renderItem={({ item }) => (
          <TaskItem 
            task={item as Task} 
            onToggle={handleToggle} 
            onDelete={handleDelete} 
          />
        )}
        estimatedItemSize={80}
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Typography variant="body" className="text-gray-400">No tasks found. Relax!</Typography>
          </View>
        }
      />

      <TaskModal 
        isVisible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        onSave={handleAddTask} 
      />
    </View>
  );
}

// Add TextInput since I missed it in imports
import { TextInput } from 'react-native';
