import { addDays, addHours, format, parseISO, setHours, setMinutes, startOfToday } from 'date-fns';

export function parseNaturalLanguageDate(input: string): { date: Date; text: string } {
  const now = new Date();
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes('today')) {
    return { date: startOfToday(), text: 'Today' };
  }

  if (lowerInput.includes('tomorrow')) {
    return { date: addDays(startOfToday(), 1), text: 'Tomorrow' };
  }

  const dayMatch = lowerInput.match(/in (\d+) day[s]?/);
  if (dayMatch) {
    const days = parseInt(dayMatch[1], 10);
    return { date: addDays(startOfToday(), days), text: `In ${days} days` };
  }

  const hourMatch = lowerInput.match(/in (\d+) hour[s]?/);
  if (hourMatch) {
    const hours = parseInt(hourMatch[1], 10);
    return { date: addHours(now, hours), text: `In ${hours} hours` };
  }

  return { date: now, text: 'Now' };
}

export function extractTodoTitle(input: string): string {
  const patterns = [
    /tomorrow/i,
    /today/i,
    /in \d+ day[s]?/i,
    /in \d+ hour[s]?/i,
  ];

  let title = input;
  patterns.forEach(pattern => {
    title = title.replace(pattern, '');
  });

  return title.trim();
}
