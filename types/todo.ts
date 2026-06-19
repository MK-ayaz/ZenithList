export type Priority = 'low' | 'medium' | 'high';
export type Category = 'Personal' | 'Work' | 'Health' | 'Finance' | 'Shopping' | 'Other';

export interface Todo {
  id: number;
  title: string;
  description?: string;
  dueDate: string; // ISO string
  priority: Priority;
  category: Category;
  isCompleted: boolean;
  createdAt: string;
  reminderScheduled: boolean;
}

export interface AppStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
}
