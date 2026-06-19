export type Priority = 'Low' | 'Medium' | 'High';
export type Category = 'Personal' | 'Work' | 'Health' | 'Shopping' | 'Other';
export type Recurrence = 'None' | 'Daily' | 'Weekly' | 'Monthly';

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string; // ISO string
  priority: Priority;
  category: Category;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  recurrence: Recurrence;
  reminderSet: boolean;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  reminderLeadTime: number; // minutes
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  currentStreak: number;
  priorityDistribution: {
    Low: number;
    Medium: number;
    High: number;
  };
}
