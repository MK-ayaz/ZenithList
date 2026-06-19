import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { styled } from 'nativewind';
import { Stats } from '../components/dashboard/Stats';
import { todoService } from '../services/db';
import { AppStats } from '../types/todo';

const StyledView = styled(View);

export default function Page() {
  const [stats, setStats] = useState<AppStats | null>(null);

  useEffect(() => {
    todoService.getStats().then(setStats);
  }, []);

  if (!stats) return null;

  return (
    <StyledView className="flex-1 px-6 pt-4">
      <Stats stats={stats} />
    </StyledView>
  );
}
