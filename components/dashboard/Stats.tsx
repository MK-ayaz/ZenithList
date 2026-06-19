import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';
import { AppStats } from '../../types/todo';
import { Card } from '../ui/Card';

const StyledView = styled(View);
const StyledText = styled(Text);

interface StatsProps {
  stats: AppStats;
}

export const Stats: React.FC<StatsProps> = ({ stats }) => {
  return (
    <View className="flex-row justify-between gap-4 mb-6">
      <Card className="flex-1 items-center">
        <StyledText className="text-slate-500 dark:text-slate-400 text-xs mb-1">Completed</StyledText>
        <StyledText className="text-2xl font-bold text-primary-500">{stats.completedTasks}</StyledText>
      </Card>
      <Card className="flex-1 items-center">
        <StyledText className="text-slate-500 dark:text-slate-400 text-xs mb-1">Pending</StyledText>
        <StyledText className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.pendingTasks}</StyledText>
      </Card>
      <Card className="flex-1 items-center">
        <StyledText className="text-slate-500 dark:text-slate-400 text-xs mb-1">Rate</StyledText>
        <StyledText className="text-2xl font-bold text-accent">{stats.completionRate.toFixed(0)}%</StyledText>
      </Card>
    </View>
  );
};
