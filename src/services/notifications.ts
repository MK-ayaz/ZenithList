import { Platform } from "react-native";

let Notifications: typeof import("expo-notifications") | null = null;

try {
  Notifications = require("expo-notifications");
  Notifications!.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch (e) {
  // expo-notifications not available in Expo Go on Android
}

const ANDROID_CHANNEL_ID = "zenithlist-reminders";

export async function initializeNotifications(): Promise<boolean> {
  if (!Notifications) return false;

  try {
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
  } catch (e) {
    return false;
  }
}

export async function scheduleTaskNotification(
  taskId: string,
  title: string,
  dueDate: Date
): Promise<string | null> {
  if (!Notifications) return null;

  try {
    const now = new Date();
    if (dueDate <= now) return null;

    const triggerDate = new Date(dueDate.getTime() - 5 * 60 * 1000);
    if (triggerDate <= now) {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
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
        title,
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
  } catch (e) {
    return null;
  }
}

export async function cancelNotification(notificationId: string): Promise<void> {
  if (!Notifications) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (e) {
    // ignore
  }
}

export async function cancelAllNotifications(): Promise<void> {
  if (!Notifications) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    // ignore
  }
}

export function setupNotificationResponseHandler(
  onNavigate: (url: string) => void
): { remove: () => void } {
  if (!Notifications) {
    return { remove: () => {} };
  }

  try {
    return Notifications.addNotificationResponseReceivedListener((response) => {
      const url = response.notification.request.content.data?.url;
      if (typeof url === "string") {
        onNavigate(url);
      }
    });
  } catch (e) {
    return { remove: () => {} };
  }
}
