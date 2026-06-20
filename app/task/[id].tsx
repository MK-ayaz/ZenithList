import { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, Platform, Alert, KeyboardAvoidingView, useColorScheme, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTaskStore } from "../../src/stores/taskStore";
import { useCategoryStore } from "../../src/stores/categoryStore";
import { useSettingsStore } from "../../src/stores/settingsStore";
import { Input } from "../../src/components/Input";
import { Button } from "../../src/components/Button";
import { Priority, RecurrenceType } from "../../src/types";
import { Colors } from "../../src/utils/theme";

const RECURRENCE: { label: string; value: RecurrenceType | null }[] = [
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
  const colorScheme = useColorScheme();
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === "dark" || (theme === "system" && colorScheme === "dark");
  const c = isDark ? Colors.dark : Colors.light;

  const PRIORITIES: { label: string; value: Priority; color: string }[] = [
    { label: "High", value: "high", color: c.high },
    { label: "Medium", value: "medium", color: c.medium },
    { label: "Low", value: "low", color: c.low },
    { label: "None", value: "none", color: c.none },
  ];
  const task = tasks.find((t) => t.id === id);

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState<Priority>(task?.priority ?? "none");
  const [categoryId, setCategoryId] = useState<string | null>(task?.categoryId ?? null);
  const [isRecurring, setIsRecurring] = useState(task?.isRecurring ?? false);
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType | null>(task?.recurrenceType ?? null);

  useEffect(() => {
    if (task) { setTitle(task.title); setDescription(task.description); setPriority(task.priority); setCategoryId(task.categoryId); setIsRecurring(task.isRecurring); setRecurrenceType(task.recurrenceType); }
  }, [task]);

  if (!task) {
    return (
      <View style={[styles.notFound, { backgroundColor: c.surface }]}>
        <Ionicons name="alert-circle-outline" size={48} color={c.textMuted} />
        <Text style={[styles.notFoundText, { color: c.textTertiary }]}>Task not found</Text>
      </View>
    );
  }

  const handleSave = () => {
    if (!title.trim()) { Alert.alert("Error", "Please enter a task title"); return; }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    updateTask(id!, { title: title.trim(), description: description.trim(), priority, categoryId, isRecurring, recurrenceType });
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
      <ScrollView style={[styles.container, { backgroundColor: c.surface }]} contentContainerStyle={styles.content}>
        <Input label="Title" value={title} onChangeText={setTitle} placeholder="What needs to be done?" iconName="create-outline" />
        <Input label="Description" value={description} onChangeText={setDescription} placeholder="Add details..." multiline iconName="document-text-outline" />

        <Text style={[styles.sectionLabel, { color: c.textDark }]}>Priority</Text>
        <View style={styles.chipRow}>
          {PRIORITIES.map((p) => (
            <Pressable key={p.value} onPress={() => { Haptics.selectionAsync(); setPriority(p.value); }}
              style={[styles.chip, { backgroundColor: c.card, borderColor: c.border }, priority === p.value && { backgroundColor: p.color, borderColor: p.color }]}>
              <Ionicons name={priority === p.value ? "checkmark" : "flag-outline"} size={14} color={priority === p.value ? c.textInverse : p.color} />
              <Text style={[styles.chipText, { color: c.textDark }, priority === p.value && { color: c.textInverse }]}>{p.label}</Text>
            </Pressable>
          ))}
        </View>

        {categories.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { color: c.textDark }]}>Category</Text>
            <View style={styles.chipRow}>
              {categories.map((cat) => (
                <Pressable key={cat.id} onPress={() => { Haptics.selectionAsync(); setCategoryId(categoryId === cat.id ? null : cat.id); }}
                  style={[styles.chip, { backgroundColor: c.card, borderColor: c.border }, categoryId === cat.id && { backgroundColor: cat.color, borderColor: cat.color }]}>
                  <View style={[styles.catDot, { backgroundColor: categoryId === cat.id ? c.textInverse : cat.color }]} />
                  <Text style={[styles.chipText, { color: c.textDark }, categoryId === cat.id && { color: c.textInverse }]}>{cat.name}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        <Text style={[styles.sectionLabel, { color: c.textDark }]}>Recurrence</Text>
        <View style={styles.chipRow}>
          {RECURRENCE.map((opt) => (
            <Pressable key={opt.label} onPress={() => { Haptics.selectionAsync(); setRecurrenceType(opt.value); setIsRecurring(!!opt.value); }}
              style={[styles.chip, { backgroundColor: c.card, borderColor: c.border }, recurrenceType === opt.value && { backgroundColor: c.primary, borderColor: c.primary }]}>
              <Text style={[styles.chipText, { color: c.textDark }, recurrenceType === opt.value && { color: c.textInverse }]}>{opt.label}</Text>
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
  container: { flex: 1 },
  content: { padding: 20 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFoundText: { fontSize: 16, marginTop: 12 },
  sectionLabel: { fontSize: 13, fontWeight: "700", marginBottom: 10, marginTop: 8, letterSpacing: 0.3, textTransform: "uppercase" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 16, gap: 8 },
  chip: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, gap: 6 },
  chipText: { fontSize: 13, fontWeight: "600" },
  catDot: { width: 8, height: 8, borderRadius: 4 },
});
