import { useState } from "react";
import { View, Text, ScrollView, Pressable, Platform, Alert, KeyboardAvoidingView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useTaskStore } from "../../src/stores/taskStore";
import { useCategoryStore } from "../../src/stores/categoryStore";
import { useSettingsStore } from "../../src/stores/settingsStore";
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
  { label: "None", value: null, icon: "close-circle" as const },
  { label: "Daily", value: "daily", icon: "repeat" as const },
  { label: "Weekly", value: "weekly", icon: "repeat" as const },
  { label: "Monthly", value: "monthly", icon: "repeat" as const },
  { label: "Yearly", value: "yearly", icon: "repeat" as const },
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
    if (!title.trim()) { Alert.alert("Error", "Please enter a task title"); return; }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addTask({ title: title.trim(), description: description.trim(), dueDate: null, priority, categoryId, isRecurring, recurrenceType: recurrenceType as any });
    router.back();
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
              <Ionicons name={opt.icon} size={14} color={recurrenceType === opt.value ? "#fff" : "#64748b"} />
              <Text style={[styles.chipText, recurrenceType === opt.value && { color: "#fff" }]}>{opt.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={{ marginTop: 24 }}>
          <Button title="Create Task" iconName="checkmark-circle" onPress={handleSave} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 20 },
  sectionLabel: { fontSize: 13, fontWeight: "700", color: "#475569", marginBottom: 10, marginTop: 8, letterSpacing: 0.3, textTransform: "uppercase" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 16, gap: 8 },
  chip: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: "#e2e8f0", backgroundColor: "#ffffff", gap: 6 },
  chipActive: { backgroundColor: "#6366f1", borderColor: "#6366f1" },
  chipText: { fontSize: 13, fontWeight: "600", color: "#475569" },
  catDot: { width: 8, height: 8, borderRadius: 4 },
});
