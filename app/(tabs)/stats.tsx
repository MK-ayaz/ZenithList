import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { dbService } from '../../services/db';
import { Typography, Card } from '../../components/UI';

export default function StatsScreen() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    const data = await dbService.getStats();
    setStats(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background-light dark:bg-background-dark">
        <ActivityIndicator color="#3b82f6" />
      </View>
    );
  }

  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark px-4 pt-12">
      <Typography variant="h1" className="mb-6">Productivity</Typography>
      
      <View className="flex-row gap-4 mb-6">
        <Card className="flex-1 items-center">
          <Typography variant="caption">Completion Rate</Typography>
          <Typography variant="h2" className="text-primary-500">{completionRate}%</Typography>
        </Card>
        <Card className="flex-1 items-center">
          <Typography variant="caption">Tasks Done</Typography>
          <Typography variant="h2" className="text-primary-500">{stats.completedTasks}</Typography>
        </Card>
      </View>

      <Typography variant="h2" className="mb-4">Priority Distribution</Typography>
      <Card className="gap-4">
        {Object.entries(stats.priorityDistribution).map(([priority, count]) => (
          <View key={priority} className="flex-row justify-between items-center">
            <Typography variant="body">{priority}</Typography>
            <Typography variant="body" className="font-bold">{String(count)}</Typography>
          </View>
        ))}
      </Card>
    </View>
  );
}
