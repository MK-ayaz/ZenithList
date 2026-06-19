import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import { useTaskStore } from "../../src/stores/taskStore";
import { useCategoryStore } from "../../src/stores/categoryStore";
import { useSettingsStore } from "../../src/stores/settingsStore";
import { Input } from "../../src/components/Input";
import { Button } from "../../src/components/Button";
import { cn } from "../../src/utils/cn";
import { Priority } from "../../src/types";

const PRIORITIES: Priority[] = ["high", "medium", "low", "none"];
const RECURRENCE_OPTIONS = [
  { label: "None", value: null },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

export default function NewTaskScreen() {
  const router = useRouter();
  const addTask = useTaskStore((s) => s.addTask);
  const categories = useCategoryStore((s) => s.categories);
  const defaultPriority = useSettingsStore((s) => s.defaultPriority);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>(defaultPriority);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<string | null>(null);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a task title");
      return;
    }

    addTask({
      title: title.trim(),
      description: description.trim(),
      dueDate: null,
      priority,
      categoryId,
      isRecurring,
      recurrenceType: recurrenceType as any,
    });

    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-white dark:bg-gray-950">
        <View className="p-4">
          <Input
            label="Task Title"
            value={title}
            onChangeText={setTitle}
            placeholder="What needs to be done?"
          />

          <Input
            label="Description (optional)"
            value={description}
            onChangeText={setDescription}
            placeholder="Add some details..."
            multiline
            numberOfLines={3}
          />

          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Priority
          </Text>
          <View className="flex-row mb-6">
            {PRIORITIES.map((p) => (
              <Pressable
                key={p}
                onPress={() => setPriority(p)}
                className={cn(
                  "px-4 py-2 rounded-lg mr-2",
                  priority === p ? "bg-primary-600" : "bg-gray-100 dark:bg-gray-800"
                )}
              >
                <Text
                  className={cn(
                    "font-medium capitalize",
                    priority === p
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400"
                  )}
                >
                  {p}
                </Text>
              </Pressable>
            ))}
          </View>

          {categories.length > 0 && (
            <>
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </Text>
              <View className="flex-row flex-wrap mb-6">
                {categories.map((cat) => (
                  <Pressable
                    key={cat.id}
                    onPress={() =>
                      setCategoryId(categoryId === cat.id ? null : cat.id)
                    }
                    className={cn(
                      "flex-row items-center px-3 py-2 rounded-lg mr-2 mb-2",
                      categoryId === cat.id
                        ? "bg-primary-600"
                        : "bg-gray-100 dark:bg-gray-800"
                    )}
                  >
                    <View
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: cat.color }}
                    />
                    <Text
                      className={cn(
                        "font-medium",
                        categoryId === cat.id
                          ? "text-white"
                          : "text-gray-600 dark:text-gray-400"
                      )}
                    >
                      {cat.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}

          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Recurrence
          </Text>
          <View className="flex-row flex-wrap mb-6">
            {RECURRENCE_OPTIONS.map((opt) => (
              <Pressable
                key={opt.label}
                onPress={() => {
                  setRecurrenceType(opt.value);
                  setIsRecurring(!!opt.value);
                }}
                className={cn(
                  "px-4 py-2 rounded-lg mr-2 mb-2",
                  recurrenceType === opt.value
                    ? "bg-primary-600"
                    : "bg-gray-100 dark:bg-gray-800"
                )}
              >
                <Text
                  className={cn(
                    "font-medium",
                    recurrenceType === opt.value
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400"
                  )}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Button title="Create Task" onPress={handleSave} className="mb-4" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
