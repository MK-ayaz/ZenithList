import { useState } from "react";
import { View, Text, FlatList, Pressable, Alert, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCategoryStore } from "../src/stores/categoryStore";
import { useTaskStore } from "../src/stores/taskStore";
import { EmptyState } from "../src/components/EmptyState";
import { Button } from "../src/components/Button";

const COLORS = ["#6366f1", "#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316", "#14b8a6"];

export default function CategoriesScreen() {
  const categories = useCategoryStore((s) => s.categories);
  const addCategory = useCategoryStore((s) => s.addCategory);
  const deleteCategory = useCategoryStore((s) => s.deleteCategory);
  const tasks = useTaskStore((s) => s.tasks);
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
      <View style={styles.container}>
        <EmptyState iconName="folder-open" title="No categories" description="Create categories to organize your tasks" />
        <View style={{ padding: 16 }}><Button title="Add Category" iconName="add-circle" onPress={() => setIsAdding(true)} /></View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isAdding && (
        <View style={styles.addForm}>
          <TextInput value={newName} onChangeText={setNewName} placeholder="Category name" style={styles.input} placeholderTextColor="#94a3b8" autoFocus />
          <View style={styles.colorGrid}>
            {COLORS.map((color) => (
              <Pressable key={color} onPress={() => { Haptics.selectionAsync(); setSelectedColor(color); }}
                style={[styles.colorDot, { backgroundColor: color }, selectedColor === color && styles.colorDotSelected]} />
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
            <View style={styles.categoryItem}>
              <View style={[styles.iconBg, { backgroundColor: item.color + "15" }]}>
                <Ionicons name="folder" size={22} color={item.color} />
              </View>
              <View style={styles.catInfo}>
                <Text style={styles.catName}>{item.name}</Text>
                <Text style={styles.catCount}>{taskCount} task{taskCount !== 1 ? "s" : ""}</Text>
              </View>
              <Pressable onPress={() => handleDelete(item.id, item.name)} hitSlop={12}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
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
  container: { flex: 1, backgroundColor: "#f8fafc" },
  addForm: { padding: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  input: { backgroundColor: "#f8fafc", borderRadius: 12, borderWidth: 1, borderColor: "#e2e8f0", paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: "#0f172a", marginBottom: 12 },
  colorGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  colorDot: { width: 32, height: 32, borderRadius: 16 },
  colorDotSelected: { borderWidth: 3, borderColor: "#0f172a", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  categoryItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#ffffff", borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: "#f1f5f9" },
  iconBg: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 14 },
  catInfo: { flex: 1 },
  catName: { fontSize: 16, fontWeight: "600", color: "#0f172a" },
  catCount: { fontSize: 13, color: "#64748b", marginTop: 2 },
});
