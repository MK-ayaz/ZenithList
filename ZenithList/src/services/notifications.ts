import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const ANDROID_CHANNEL_ID = "zenithlist-reminders";

export async function initializeNotifications(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
      name: "Task Reminders",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: "default",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
}

export async function scheduleTaskNotification(
  taskId: string,
  title: string,
  dueDate: Date
): Promise<string | null> {
  const now = new Date();
  if (dueDate <= now) return null;

  const triggerDate = new Date(dueDate.getTime() - 5 * 60 * 1000);
  if (triggerDate <= now) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${title}`,
        body: "This task is due now!",
        data: { taskId, url: `/task/${taskId}` },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
      },
    });
    return id;
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: `${title}`,
      body: "Due soon",
      data: { taskId, url: `/task/${taskId}` },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
      channelId: ANDROID_CHANNEL_ID,
    },
  });
  return id;
}

export async function cancelNotification(
  notificationId: string
): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export function setupNotificationResponseHandler(
  onNavigate: (url: string) => void
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const url = response.notification.request.content.data?.url;
    if (typeof url === "string") {
      onNavigate(url);
    }
  });
}
