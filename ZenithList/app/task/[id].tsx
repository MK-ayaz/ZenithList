import { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, Platform, Alert, KeyboardAvoidingView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTaskStore } from "../../src/stores/taskStore";
import { useCategoryStore } from "../../src/stores/categoryStore";
import { Input } from "../../src/components/Input";
import { Button } from "../../src/components/Button";
import { Priority } from "../../src/types";

const PRIORITIES: { label: string; value: Priority; color: string }[] = [
  { label: "High", value: "high", color: "#ef4444" },
  { label: "Medium", value: "medium", color: "#f59e0b" },
  { label: "Low", value: "low", color: "#3b82f6" },
  { label: "None", value: "none", color: "#94a3b8" },
];
const RECURRENCE = [
  { label: "None", value: null },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const tasks = useTaskStore((s) => s.tasks);
  const updateTask = useTaskStore((s) => s.updateTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const categories = useCategoryStore((s) => s.categories);
  const task = tasks.find((t) => t.id === id);

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState<Priority>(task?.priority ?? "none");
  const [categoryId, setCategoryId] = useState<string | null>(task?.categoryId ?? null);
  const [isRecurring, setIsRecurring] = useState(task?.isRecurring ?? false);
  const [recurrenceType, setRecurrenceType] = useState<string | null>(task?.recurrenceType ?? null);

  useEffect(() => {
    if (task) { setTitle(task.title); setDescription(task.description); setPriority(task.priority); setCategoryId(task.categoryId); setIsRecurring(task.isRecurring); setRecurrenceType(task.recurrenceType); }
  }, [task]);

  if (!task) {
    return (
      <View style={styles.notFound}>
        <Ionicons name="alert-circle-outline" size={48} color="#cbd5e1" />
        <Text style={styles.notFoundText}>Task not found</Text>
      </View>
    );
  }

  const handleSave = () => {
    if (!title.trim()) { Alert.alert("Error", "Please enter a task title"); return; }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    updateTask(id!, { title: title.trim(), description: description.trim(), priority, categoryId, isRecurring, recurrenceType: recurrenceType as any });
    router.back();
  };

  const handleDelete = () => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); deleteTask(id!); router.back(); } },
    ]);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Input label="Title" value={title} onChangeText={setTitle} placeholder="What needs to be done?" iconName="create-outline" />
        <Input label="Description" value={description} onChangeText={setDescription} placeholder="Add details..." multiline iconName="document-text-outline" />

        <Text style={styles.sectionLabel}>Priority</Text>
        <View style={styles.chipRow}>
          {PRIORITIES.map((p) => (
            <Pressable key={p.value} onPress={() => { Haptics.selectionAsync(); setPriority(p.value); }}
              style={[styles.chip, priority === p.value && { backgroundColor: p.color, borderColor: p.color }]}>
              <Ionicons name={priority === p.value ? "checkmark" : "flag-outline"} size={14} color={priority === p.value ? "#fff" : p.color} />
              <Text style={[styles.chipText, priority === p.value && { color: "#fff" }]}>{p.label}</Text>
            </Pressable>
          ))}
        </View>

        {categories.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Category</Text>
            <View style={styles.chipRow}>
              {categories.map((cat) => (
                <Pressable key={cat.id} onPress={() => { Haptics.selectionAsync(); setCategoryId(categoryId === cat.id ? null : cat.id); }}
                  style={[styles.chip, categoryId === cat.id && { backgroundColor: cat.color, borderColor: cat.color }]}>
                  <View style={[styles.catDot, { backgroundColor: categoryId === cat.id ? "#fff" : cat.color }]} />
                  <Text style={[styles.chipText, categoryId === cat.id && { color: "#fff" }]}>{cat.name}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        <Text style={styles.sectionLabel}>Recurrence</Text>
        <View style={styles.chipRow}>
          {RECURRENCE.map((opt) => (
            <Pressable key={opt.label} onPress={() => { Haptics.selectionAsync(); setRecurrenceType(opt.value); setIsRecurring(!!opt.value); }}
              style={[styles.chip, recurrenceType === opt.value && styles.chipActive]}>
              <Text style={[styles.chipText, recurrenceType === opt.value && { color: "#fff" }]}>{opt.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={{ marginTop: 24 }}>
          <Button title="Save Changes" iconName="save" onPress={handleSave} />
          <View style={{ height: 12 }} />
          <Button title="Delete Task" variant="danger" iconName="trash" onPress={handleDelete} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 20 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc" },
  notFoundText: { fontSize: 16, color: "#94a3b8", marginTop: 12 },
  sectionLabel: { fontSize: 13, fontWeight: "700", color: "#475569", marginBottom: 10, marginTop: 8, letterSpacing: 0.3, textTransform: "uppercase" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 16, gap: 8 },
  chip: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: "#e2e8f0", backgroundColor: "#ffffff", gap: 6 },
  chipActive: { backgroundColor: "#6366f1", borderColor: "#6366f1" },
  chipText: { fontSize: 13, fontWeight: "600", color: "#475569" },
  catDot: { width: 8, height: 8, borderRadius: 4 },
});
