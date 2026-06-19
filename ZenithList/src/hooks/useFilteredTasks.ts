import { useState, useMemo } from "react";
import { useTaskStore } from "../stores/taskStore";
import { useCategoryStore } from "../stores/categoryStore";
import { Task } from "../types";

export function useFilteredTasks(view: "today" | "upcoming" | "inbox" | "completed", searchQuery?: string) {
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useCategoryStore((s) => s.categories);

  const filteredTasks = useMemo(() => {
    let result: Task[] = [];

    switch (view) {
      case "today": {
        const today = new Date().toISOString().split("T")[0];
        const overdue = tasks.filter(
          (t) => !t.completedAt && t.dueDate && t.dueDate < today && t.dueDate?.split("T")[0] !== today
        );
        const dueToday = tasks.filter(
          (t) => !t.completedAt && t.dueDate?.startsWith(today)
        );
        result = [...overdue, ...dueToday];
        break;
      }
      case "upcoming": {
        const now = new Date();
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        result = tasks.filter(
          (t) =>
            !t.completedAt &&
            t.dueDate &&
            t.dueDate > now.toISOString() &&
            t.dueDate <= weekFromNow.toISOString()
        );
        break;
      }
      case "inbox":
        result = tasks.filter((t) => !t.completedAt && !t.dueDate);
        break;
      case "completed":
        result = tasks.filter((t) => t.completedAt);
        break;
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => {
      const priorityOrder: Record<string, number> = {
        high: 0,
        medium: 1,
        low: 2,
        none: 3,
      };
      return (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3);
    });
  }, [tasks, view, searchQuery]);

  return filteredTasks;
}
