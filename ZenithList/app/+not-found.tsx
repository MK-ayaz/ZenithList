import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-950">
      <Text className="text-6xl mb-4">🔍</Text>
      <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Page Not Found
      </Text>
      <Text className="text-gray-500 dark:text-gray-400 mb-6">
        This screen doesn't exist
      </Text>
      <Link href="/" className="bg-primary-600 px-6 py-3 rounded-xl">
        <Text className="text-white font-semibold">Go Home</Text>
      </Link>
    </View>
  );
}
