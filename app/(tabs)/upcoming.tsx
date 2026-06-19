import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { dbService } from '../../services/db';
import { TaskItem } from '../../components/TaskItem';
import { Typography } from '../../components/UI';
import { Task } from '../../types';

export default function UpcomingScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    const data = await dbService.getTasks('upcoming');
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

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background-light dark:bg-background-dark">
        <ActivityIndicator color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark px-4 pt-12">
      <Typography variant="h1" className="mb-6">Upcoming</Typography>
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
            <Typography variant="body" className="text-gray-400">Nothing planned yet!</Typography>
          </View>
        }
      />
    </View>
  );
}
