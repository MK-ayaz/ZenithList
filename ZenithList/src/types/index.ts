export type Priority = "none" | "low" | "medium" | "high";

export type RecurrenceType = "daily" | "weekly" | "monthly" | "yearly" | null;

export type ThemeMode = "light" | "dark" | "system";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  priority: Priority;
  categoryId: string | null;
  isRecurring: boolean;
  recurrenceType: RecurrenceType;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateTaskInput = Omit<
  Task,
  "id" | "createdAt" | "updatedAt" | "completedAt"
>;

export type UpdateTaskInput = Partial<Omit<Task, "id" | "createdAt">>;

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export type CreateCategoryInput = Omit<Category, "id">;

export type UpdateCategoryInput = Partial<Omit<Category, "id">>;

export interface UserSettings {
  theme: ThemeMode;
  defaultPriority: Priority;
  notificationsEnabled: boolean;
  notificationTime: string;
  showCompletedTasks: boolean;
  sortBy: "dueDate" | "priority" | "createdAt";
  sortOrder: "asc" | "desc";
}
