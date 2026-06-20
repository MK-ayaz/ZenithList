import { useState } from "react";
import { View, Text, FlatList, Pressable, Alert, TextInput, useColorScheme, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCategoryStore } from "../src/stores/categoryStore";
import { useTaskStore } from "../src/stores/taskStore";
import { useSettingsStore } from "../src/stores/settingsStore";
import { EmptyState } from "../src/components/EmptyState";
import { Button } from "../src/components/Button";
import { Colors } from "../src/utils/theme";

const COLORS = ["#6366f1", "#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316", "#14b8a6"];

export default function CategoriesScreen() {
  const categories = useCategoryStore((s) => s.categories);
  const addCategory = useCategoryStore((s) => s.addCategory);
  const deleteCategory = useCategoryStore((s) => s.deleteCategory);
  const tasks = useTaskStore((s) => s.tasks);
  const colorScheme = useColorScheme();
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === "dark" || (theme === "system" && colorScheme === "dark");
  const c = isDark ? Colors.dark : Colors.light;
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const handleAdd = () => {
    if (!newName.trim()) { Alert.alert("Error", "Please enter a category name"); return; }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addCategory({ name: newName.trim(), color: selectedColor, icon: "folder" });
    setNewName(""); setIsAdding(false);
  };

  const handleDelete = (id: string, name: string) => {
    const taskCount = tasks.filter((t) => t.categoryId === id).length;
    Alert.alert("Delete Category", taskCount > 0 ? `"${name}" has ${taskCount} tasks. Delete?` : `Delete "${name}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); deleteCategory(id); } },
    ]);
  };

  if (categories.length === 0 && !isAdding) {
    return (
      <View style={[styles.container, { backgroundColor: c.surface }]}>
        <EmptyState iconName="folder-open" title="No categories" description="Create categories to organize your tasks" isDark={isDark} />
        <View style={{ padding: 16 }}><Button title="Add Category" iconName="add-circle" onPress={() => setIsAdding(true)} /></View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: c.surface }]}>
      {isAdding && (
        <View style={[styles.addForm, { backgroundColor: c.card, borderBottomColor: c.borderLight }]}>
          <TextInput value={newName} onChangeText={setNewName} placeholder="Category name" style={[styles.input, { backgroundColor: c.surface, borderColor: c.border, color: c.text }]} placeholderTextColor={c.textTertiary} autoFocus />
          <View style={styles.colorGrid}>
            {COLORS.map((color) => (
              <Pressable key={color} onPress={() => { Haptics.selectionAsync(); setSelectedColor(color); }}
                style={[styles.colorDot, { backgroundColor: color }, selectedColor === color && { borderWidth: 3, borderColor: c.text }]} />
            ))}
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={{ flex: 1 }}><Button title="Cancel" variant="secondary" onPress={() => { setIsAdding(false); setNewName(""); }} /></View>
            <View style={{ flex: 1 }}><Button title="Add" iconName="add" onPress={handleAdd} /></View>
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
            <View style={[styles.categoryItem, { backgroundColor: c.card, borderColor: c.borderLight }]}>
              <View style={[styles.iconBg, { backgroundColor: item.color + "15" }]}>
                <Ionicons name="folder" size={22} color={item.color} />
              </View>
              <View style={styles.catInfo}>
                <Text style={[styles.catName, { color: c.text }]}>{item.name}</Text>
                <Text style={[styles.catCount, { color: c.textSecondary }]}>{taskCount} task{taskCount !== 1 ? "s" : ""}</Text>
              </View>
              <Pressable onPress={() => handleDelete(item.id, item.name)} hitSlop={12}>
                <Ionicons name="trash-outline" size={20} color={c.danger} />
              </Pressable>
            </View>
          );
        }}
        ListFooterComponent={!isAdding ? <Button title="Add Category" variant="ghost" iconName="add-circle" onPress={() => setIsAdding(true)} /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  addForm: { padding: 16, borderBottomWidth: 1 },
  input: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, marginBottom: 12 },
  colorGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  colorDot: { width: 32, height: 32, borderRadius: 16 },
  categoryItem: { flexDirection: "row", alignItems: "center", borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1 },
  iconBg: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 14 },
  catInfo: { flex: 1 },
  catName: { fontSize: 16, fontWeight: "600" },
  catCount: { fontSize: 13, marginTop: 2 },
});
