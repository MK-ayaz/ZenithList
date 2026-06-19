import { isToday, isAfter, startOfToday, format } from 'date-fns';

export const isUpcoming = (dateString: string) => {
  const date = new Date(dateString);
  return isAfter(date, startOfToday()) && !isToday(date);
};

export const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM d, yyyy');
};

export const formatTime = (dateString: string) => {
  return format(new Date(dateString), 'p');
};
