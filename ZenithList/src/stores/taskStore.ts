import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task, CreateTaskInput, UpdateTaskInput } from "../types";
import { generateId } from "../utils/id";
import { calculateNextRecurrence } from "../utils/date";

interface TaskState {
  tasks: Task[];
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
        const task = get().tasks.find((t) => t.id === id);
        const now = new Date().toISOString();

        set((state) => {
          const updated = state.tasks.map((t) =>
            t.id === id
              ? { ...t, completedAt: now, updatedAt: now }
              : t
          );

          if (task?.isRecurring && task.recurrenceType && task.dueDate) {
            const nextDueDate = calculateNextRecurrence(task.dueDate, task.recurrenceType);
            const nextTask: Task = {
              ...task,
              id: generateId(),
              dueDate: nextDueDate,
              completedAt: null,
              createdAt: now,
              updatedAt: now,
            };
            return { tasks: [...updated, nextTask] };
          }

          return { tasks: updated };
        });
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
        const today = new Date().toISOString().split("T")[0];
        return get().tasks.filter(
          (t) => !t.completedAt && t.dueDate && t.dueDate.split("T")[0] < today
        );
      },

      getUpcomingTasks: () => {
        const today = new Date().toISOString().split("T")[0];
        const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        return get().tasks.filter(
          (t) =>
            !t.completedAt &&
            t.dueDate &&
            t.dueDate.split("T")[0] > today &&
            t.dueDate.split("T")[0] <= weekFromNow
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
