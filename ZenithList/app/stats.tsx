import { View, Text, ScrollView } from "react-native";
import { useTaskStore } from "../src/stores/taskStore";
import { useCategoryStore } from "../src/stores/categoryStore";

export default function StatsScreen() {
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useCategoryStore((s) => s.categories);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completedAt).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const today = new Date().toISOString().split("T")[0];
  const tasksCreatedToday = tasks.filter((t) => t.createdAt.startsWith(today)).length;
  const tasksCompletedToday = tasks.filter(
    (t) => t.completedAt?.startsWith(today)
  ).length;

  const highPriority = tasks.filter((t) => t.priority === "high" && !t.completedAt).length;
  const mediumPriority = tasks.filter((t) => t.priority === "medium" && !t.completedAt).length;
  const lowPriority = tasks.filter((t) => t.priority === "low" && !t.completedAt).length;

  const categoryStats = categories.map((cat) => ({
    name: cat.name,
    color: cat.color,
    total: tasks.filter((t) => t.categoryId === cat.id).length,
    completed: tasks.filter((t) => t.categoryId === cat.id && t.completedAt).length,
  }));

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-950">
      <View className="p-4">
        <View className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-6 mb-4">
          <Text className="text-4xl font-bold text-primary-600 mb-1">
            {completionRate}%
          </Text>
          <Text className="text-primary-700 dark:text-primary-300">
            Completion Rate
          </Text>
        </View>

        <View className="flex-row mb-4">
          <View className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mr-2">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalTasks}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Total Tasks
            </Text>
          </View>
          <View className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 ml-2">
            <Text className="text-2xl font-bold text-green-600">
              {completedTasks}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Completed
            </Text>
          </View>
        </View>

        <View className="flex-row mb-4">
          <View className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mr-2">
            <Text className="text-2xl font-bold text-amber-600">
              {pendingTasks}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Pending
            </Text>
          </View>
          <View className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 ml-2">
            <Text className="text-2xl font-bold text-blue-600">
              {tasksCompletedToday}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Done Today
            </Text>
          </View>
        </View>

        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Priority Breakdown
        </Text>
        <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
          <View className="flex-row items-center mb-2">
            <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
            <Text className="text-gray-700 dark:text-gray-300 flex-1">High</Text>
            <Text className="font-semibold text-gray-900 dark:text-white">{highPriority}</Text>
          </View>
          <View className="flex-row items-center mb-2">
            <View className="w-3 h-3 rounded-full bg-amber-500 mr-2" />
            <Text className="text-gray-700 dark:text-gray-300 flex-1">Medium</Text>
            <Text className="font-semibold text-gray-900 dark:text-white">{mediumPriority}</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
            <Text className="text-gray-700 dark:text-gray-300 flex-1">Low</Text>
            <Text className="font-semibold text-gray-900 dark:text-white">{lowPriority}</Text>
          </View>
        </View>

        {categoryStats.length > 0 && (
          <>
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              By Category
            </Text>
            <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              {categoryStats.map((stat) => (
                <View
                  key={stat.name}
                  className="flex-row items-center mb-2 last:mb-0"
                >
                  <View
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: stat.color }}
                  />
                  <Text className="text-gray-700 dark:text-gray-300 flex-1">
                    {stat.name}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 mr-2">
                    {stat.completed}/{stat.total}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}
