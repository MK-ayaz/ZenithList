import { parse, addDays, format, isToday, isAfter, startOfDay } from 'date-fns';

export const nlpParseDueDate = (input: string): { dueDate: string; cleanedTitle: string } => {
  const lowerInput = input.toLowerCase();
  let dueDate = new Date().toISOString();
  let cleanedTitle = input;

  const patterns = [
    { regex: /\btoday\b/, days: 0 },
    { regex: /\btomorrow\b/, days: 1 },
    { regex: /\bnext week\b/, days: 7 },
    { regex: /\bnext month\b/, days: 30 },
  ];

  for (const p of patterns) {
    if (p.regex.test(lowerInput)) {
      dueDate = addDays(new Date(), p.days).toISOString();
      cleanedTitle = input.replace(p.regex, '').trim();
      break;
    }
  }

  return { dueDate, cleanedTitle };
};

export const formatDate = (dateStr: string) => {
  return format(new Date(dateStr), 'MMM d, h:mm a');
};

export const isTaskDueToday = (dateStr: string) => isToday(new Date(dateStr));
export const isTaskUpcoming = (dateStr: string) => isAfter(startOfDay(new Date(dateStr)), startOfDay(new Date()));
