import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
  TextInput,
} from "react-native";
import { useCategoryStore } from "../src/stores/categoryStore";
import { useTaskStore } from "../src/stores/taskStore";
import { EmptyState } from "../src/components/EmptyState";
import { Button } from "../src/components/Button";
import { cn } from "../src/utils/cn";

const COLORS = [
  "#ef4444",
  "#f59e0b",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

export default function CategoriesScreen() {
  const categories = useCategoryStore((s) => s.categories);
  const addCategory = useCategoryStore((s) => s.addCategory);
  const deleteCategory = useCategoryStore((s) => s.deleteCategory);
  const tasks = useTaskStore((s) => s.tasks);

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const handleAdd = () => {
    if (!newName.trim()) {
      Alert.alert("Error", "Please enter a category name");
      return;
    }
    addCategory({
      name: newName.trim(),
      color: selectedColor,
      icon: "📁",
    });
    setNewName("");
    setIsAdding(false);
  };

  const handleDelete = (id: string, name: string) => {
    const taskCount = tasks.filter((t) => t.categoryId === id).length;
    Alert.alert(
      "Delete Category",
      taskCount > 0
        ? `"${name}" has ${taskCount} tasks. They will be moved to Inbox. Delete anyway?`
        : `Delete "${name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteCategory(id),
        },
      ]
    );
  };

  if (categories.length === 0 && !isAdding) {
    return (
      <View className="flex-1 bg-white dark:bg-gray-950">
        <EmptyState
          icon="📂"
          title="No categories"
          description="Create categories to organize your tasks"
        />
        <View className="p-4">
          <Button title="Add Category" onPress={() => setIsAdding(true)} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-950">
      {isAdding && (
        <View className="p-4 border-b border-gray-100 dark:border-gray-800">
          <TextInput
            value={newName}
            onChangeText={setNewName}
            placeholder="Category name"
            className="bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white mb-3"
            placeholderTextColor="#9ca3af"
            autoFocus
          />
          <View className="flex-row mb-3">
            {COLORS.map((color) => (
              <Pressable
                key={color}
                onPress={() => setSelectedColor(color)}
                className={cn(
                  "w-8 h-8 rounded-full mr-2",
                  selectedColor === color && "ring-2 ring-primary-600 ring-offset-2"
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </View>
          <View className="flex-row">
            <Button
              title="Cancel"
              variant="secondary"
              onPress={() => {
                setIsAdding(false);
                setNewName("");
              }}
              className="flex-1 mr-2"
            />
            <Button title="Add" onPress={handleAdd} className="flex-1" />
          </View>
        </View>
      )}

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const taskCount = tasks.filter((t) => t.categoryId === item.id).length;
          return (
            <View className="flex-row items-center bg-white dark:bg-gray-900 rounded-xl p-4 mb-3 border border-gray-100 dark:border-gray-800">
              <View
                className="w-4 h-4 rounded-full mr-3"
                style={{ backgroundColor: item.color }}
              />
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 dark:text-white">
                  {item.name}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  {taskCount} {taskCount === 1 ? "task" : "tasks"}
                </Text>
              </View>
              <Pressable onPress={() => handleDelete(item.id, item.name)}>
                <Text className="text-red-500 text-sm">Delete</Text>
              </Pressable>
            </View>
          );
        }}
        ListFooterComponent={
          !isAdding ? (
            <Button
              title="Add Category"
              variant="secondary"
              onPress={() => setIsAdding(true)}
            />
          ) : null
        }
      />
    </View>
  );
}
