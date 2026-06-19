import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task, CreateTaskInput, UpdateTaskInput } from "../types";
import { generateId } from "../utils/id";

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  addTask: (input: CreateTaskInput) => Task;
  updateTask: (id: string, input: UpdateTaskInput) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  uncompleteTask: (id: string) => void;
  getTasksForToday: () => Task[];
  getUpcomingTasks: () => Task[];
  getInboxTasks: () => Task[];
  getCompletedTasks: () => Task[];
  getOverdueTasks: () => Task[];
  getTasksByCategory: (categoryId: string) => Task[];
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      isLoading: false,

      addTask: (input) => {
        const task: Task = {
          ...input,
          id: generateId(),
          completedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [...state.tasks, task] }));
        return task;
      },

      updateTask: (id, input) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, ...input, updatedAt: new Date().toISOString() }
              : t
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      completeTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completedAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }));
      },

      uncompleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completedAt: null,
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }));
      },

      getTasksForToday: () => {
        const today = new Date().toISOString().split("T")[0];
        return get().tasks.filter(
          (t) => !t.completedAt && t.dueDate?.startsWith(today)
        );
      },

      getOverdueTasks: () => {
        const now = new Date().toISOString();
        return get().tasks.filter(
          (t) => !t.completedAt && t.dueDate && t.dueDate < now
        );
      },

      getUpcomingTasks: () => {
        const now = new Date();
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        return get().tasks.filter(
          (t) =>
            !t.completedAt &&
            t.dueDate &&
            t.dueDate > now.toISOString() &&
            t.dueDate <= weekFromNow.toISOString()
        );
      },

      getInboxTasks: () => {
        return get().tasks.filter((t) => !t.completedAt && !t.dueDate);
      },

      getCompletedTasks: () => {
        return get().tasks.filter((t) => t.completedAt);
      },

      getTasksByCategory: (categoryId) => {
        return get().tasks.filter(
          (t) => !t.completedAt && t.categoryId === categoryId
        );
      },
    }),
    {
      name: "zenithlist-tasks",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
