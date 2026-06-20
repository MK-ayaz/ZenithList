import { useState, useMemo } from "react";
import { useTaskStore } from "../stores/taskStore";
import { Task } from "../types";

export function useFilteredTasks(view: "today" | "upcoming" | "inbox" | "completed", searchQuery?: string) {
  const tasks = useTaskStore((s) => s.tasks);

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
        const today = new Date().toISOString().split("T")[0];
        const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        result = tasks.filter(
          (t) =>
            !t.completedAt &&
            t.dueDate &&
            t.dueDate.split("T")[0] > today &&
            t.dueDate.split("T")[0] <= weekFromNow
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
