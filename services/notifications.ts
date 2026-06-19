import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const notificationService = {
  async requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Please enable notifications to receive task reminders');
      return false;
    }
    return true;
  },

  async scheduleReminder(id: number, title: string, date: Date) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Task Reminder 🔔',
        body: title,
        data: { taskId: id },
      },
      trigger: {
        date: date,
        type: 'date' as any,
      },
    });
  },

  async cancelReminder(id: number) {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const target = scheduled.find(n => n.identifier === id.toString());
    if (target) {
      await Notifications.cancelScheduledNotificationAsync(target.identifier);
    }
  }
};
