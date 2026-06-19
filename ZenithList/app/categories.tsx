import { useState } from "react";
import { View, Text, FlatList, Pressable, Alert, TextInput, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useCategoryStore } from "../src/stores/categoryStore";
import { useTaskStore } from "../src/stores/taskStore";
import { EmptyState } from "../src/components/EmptyState";
import { Button } from "../src/components/Button";

const COLORS = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

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
    addCategory({ name: newName.trim(), color: selectedColor, icon: "folder" });
    setNewName("");
    setIsAdding(false);
  };

  const handleDelete = (id: string, name: string) => {
    const taskCount = tasks.filter((t) => t.categoryId === id).length;
    Alert.alert("Delete Category", taskCount > 0 ? `"${name}" has ${taskCount} tasks. They will be moved to Inbox. Delete anyway?` : `Delete "${name}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteCategory(id) },
    ]);
  };

  if (categories.length === 0 && !isAdding) {
    return (
      <View style={styles.container}>
        <EmptyState iconName="create-new-folder" title="No categories" description="Create categories to organize your tasks" />
        <View style={{ padding: 16 }}>
          <Button title="Add Category" onPress={() => setIsAdding(true)} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isAdding && (
        <View style={styles.addForm}>
          <TextInput value={newName} onChangeText={setNewName} placeholder="Category name" style={styles.input} placeholderTextColor="#9ca3af" autoFocus />
          <View style={styles.colorRow}>
            {COLORS.map((color) => (
              <Pressable key={color} onPress={() => setSelectedColor(color)} style={[styles.colorDot, { backgroundColor: color }, selectedColor === color && styles.colorDotSelected]} />
            ))}
          </View>
          <View style={styles.formActions}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Button title="Cancel" variant="secondary" onPress={() => { setIsAdding(false); setNewName(""); }} />
            </View>
            <View style={{ flex: 1 }}>
              <Button title="Add" onPress={handleAdd} />
            </View>
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
              <MaterialIcons name="folder" size={24} color={item.color} />
              <View style={styles.catInfo}>
                <Text style={styles.catName}>{item.name}</Text>
                <Text style={styles.catCount}>{taskCount} {taskCount === 1 ? "task" : "tasks"}</Text>
              </View>
              <Pressable onPress={() => handleDelete(item.id, item.name)}>
                <MaterialIcons name="delete-outline" size={22} color="#ef4444" />
              </Pressable>
            </View>
          );
        }}
        ListFooterComponent={!isAdding ? <Button title="Add Category" variant="secondary" onPress={() => setIsAdding(true)} /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  addForm: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  input: { backgroundColor: "#f3f4f6", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: "#111827", marginBottom: 12 },
  colorRow: { flexDirection: "row", marginBottom: 12 },
  colorDot: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  colorDotSelected: { borderWidth: 3, borderColor: "#2563eb" },
  formActions: { flexDirection: "row" },
  categoryItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#ffffff", borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#f3f4f6" },
  catInfo: { flex: 1, marginLeft: 12 },
  catName: { fontSize: 16, fontWeight: "600", color: "#111827" },
  catCount: { fontSize: 14, color: "#6b7280" },
});
