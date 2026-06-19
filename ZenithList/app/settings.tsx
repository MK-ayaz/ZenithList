import { View, Text, ScrollView, Pressable, Switch, Alert } from "react-native";
import { useSettingsStore } from "../src/stores/settingsStore";
import { useTaskStore } from "../src/stores/taskStore";
import { useCategoryStore } from "../src/stores/categoryStore";
import { cn } from "../src/utils/cn";
import { ThemeMode, Priority } from "../src/types";

const THEME_OPTIONS: { label: string; value: ThemeMode }[] = [
  { label: "System", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

const PRIORITY_OPTIONS: { label: string; value: Priority }[] = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
  { label: "None", value: "none" },
];

const SORT_OPTIONS = [
  { label: "Due Date", value: "dueDate" as const },
  { label: "Priority", value: "priority" as const },
  { label: "Created", value: "createdAt" as const },
];

export default function SettingsScreen() {
  const settings = useSettingsStore();
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useCategoryStore((s) => s.categories);

  const handleExportData = () => {
    const data = {
      tasks,
      categories,
      exportedAt: new Date().toISOString(),
    };
    Alert.alert(
      "Export Data",
      `You have ${tasks.length} tasks and ${categories.length} categories. Data export would be available in a production build.`,
      [{ text: "OK" }]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all tasks and categories. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            useTaskStore.setState({ tasks: [] });
            useCategoryStore.setState({ categories: [] });
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-950">
      <View className="p-4">
        <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-3">
          Appearance
        </Text>
        <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
          <Text className="text-gray-900 dark:text-white font-medium mb-3">
            Theme
          </Text>
          <View className="flex-row">
            {THEME_OPTIONS.map((opt) => (
              <Pressable
                key={opt.value}
                onPress={() => settings.updateTheme(opt.value)}
                className={cn(
                  "px-4 py-2 rounded-lg mr-2",
                  settings.theme === opt.value
                    ? "bg-primary-600"
                    : "bg-gray-200 dark:bg-gray-700"
                )}
              >
                <Text
                  className={cn(
                    "font-medium",
                    settings.theme === opt.value
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400"
                  )}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-3">
          Defaults
        </Text>
        <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
          <Text className="text-gray-900 dark:text-white font-medium mb-3">
            Default Priority
          </Text>
          <View className="flex-row">
            {PRIORITY_OPTIONS.map((opt) => (
              <Pressable
                key={opt.value}
                onPress={() => settings.updateDefaultPriority(opt.value)}
                className={cn(
                  "px-3 py-2 rounded-lg mr-2",
                  settings.defaultPriority === opt.value
                    ? "bg-primary-600"
                    : "bg-gray-200 dark:bg-gray-700"
                )}
              >
                <Text
                  className={cn(
                    "font-medium text-sm",
                    settings.defaultPriority === opt.value
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400"
                  )}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-3">
          Sorting
        </Text>
        <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
          <Text className="text-gray-900 dark:text-white font-medium mb-3">
            Sort By
          </Text>
          <View className="flex-row">
            {SORT_OPTIONS.map((opt) => (
              <Pressable
                key={opt.value}
                onPress={() => settings.updateSortBy(opt.value)}
                className={cn(
                  "px-3 py-2 rounded-lg mr-2",
                  settings.sortBy === opt.value
                    ? "bg-primary-600"
                    : "bg-gray-200 dark:bg-gray-700"
                )}
              >
                <Text
                  className={cn(
                    "font-medium text-sm",
                    settings.sortBy === opt.value
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400"
                  )}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-3">
          Notifications
        </Text>
        <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-900 dark:text-white font-medium">
              Enable Notifications
            </Text>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={settings.updateNotificationsEnabled}
              trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
            />
          </View>
          {settings.notificationsEnabled && (
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-900 dark:text-white font-medium">
                Show Completed Tasks
              </Text>
              <Switch
                value={settings.showCompletedTasks}
                onValueChange={settings.updateShowCompletedTasks}
                trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
              />
            </View>
          )}
        </View>

        <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-3">
          Data
        </Text>
        <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
          <Pressable onPress={handleExportData} className="mb-4">
            <Text className="text-primary-600 font-medium">Export Data</Text>
          </Pressable>
          <Pressable onPress={handleClearData}>
            <Text className="text-red-500 font-medium">Clear All Data</Text>
          </Pressable>
        </View>

        <Text className="text-center text-gray-400 dark:text-gray-500 text-sm mb-8">
          ZenithList v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}
