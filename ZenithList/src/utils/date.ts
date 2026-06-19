import {
  format,
  formatDistanceToNow,
  isToday,
  isTomorrow,
  isPast,
  isThisWeek,
  startOfDay,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  parseISO,
} from "date-fns";

export function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  if (isThisWeek(date)) return format(date, "EEEE");
  return format(date, "MMM d");
}

export function formatDateTime(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

export function formatRelativeTime(dateString: string): string {
  const date = parseISO(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return isPast(parseISO(dueDate)) && !isToday(parseISO(dueDate));
}

export function getDueDateCategory(dueDate: string | null): string {
  if (!dueDate) return "inbox";
  const date = parseISO(dueDate);
  const today = startOfDay(new Date());

  if (isPast(date) && !isToday(date)) return "overdue";
  if (isToday(date)) return "today";
  if (isTomorrow(date)) return "tomorrow";
  if (isThisWeek(date)) return "thisWeek";
  return "later";
}

export function calculateNextRecurrence(
  dueDate: string,
  recurrenceType: string
): string {
  const date = parseISO(dueDate);
  switch (recurrenceType) {
    case "daily":
      return addDays(date, 1).toISOString();
    case "weekly":
      return addWeeks(date, 1).toISOString();
    case "monthly":
      return addMonths(date, 1).toISOString();
    case "yearly":
      return addYears(date, 1).toISOString();
    default:
      return dueDate;
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "high":
      return "#ef4444";
    case "medium":
      return "#f59e0b";
    case "low":
      return "#3b82f6";
    default:
      return "#6b7280";
  }
}
