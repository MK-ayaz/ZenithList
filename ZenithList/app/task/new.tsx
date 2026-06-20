import { useState } from "react";
import { View, Text, ScrollView, Pressable, Platform, Alert, KeyboardAvoidingView, useColorScheme, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useTaskStore } from "../../src/stores/taskStore";
import { useCategoryStore } from "../../src/stores/categoryStore";
import { useSettingsStore } from "../../src/stores/settingsStore";
import { Input } from "../../src/components/Input";
import { Button } from "../../src/components/Button";
import { Priority, RecurrenceType } from "../../src/types";
import { Colors } from "../../src/utils/theme";

const RECURRENCE: { label: string; value: RecurrenceType | null; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: "None", value: null, icon: "close-circle" },
  { label: "Daily", value: "daily", icon: "repeat" },
  { label: "Weekly", value: "weekly", icon: "repeat" },
  { label: "Monthly", value: "monthly", icon: "repeat" },
  { label: "Yearly", value: "yearly", icon: "repeat" },
];

export default function NewTaskScreen() {
  const router = useRouter();
  const addTask = useTaskStore((s) => s.addTask);
  const categories = useCategoryStore((s) => s.categories);
  const defaultPriority = useSettingsStore((s) => s.defaultPriority);
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

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>(defaultPriority);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType | null>(null);

  const handleSave = () => {
    if (!title.trim()) { Alert.alert("Error", "Please enter a task title"); return; }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addTask({ title: title.trim(), description: description.trim(), dueDate: null, priority, categoryId, isRecurring, recurrenceType });
    router.back();
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
              <Ionicons name={opt.icon} size={14} color={recurrenceType === opt.value ? c.textInverse : c.textSecondary} />
              <Text style={[styles.chipText, { color: c.textDark }, recurrenceType === opt.value && { color: c.textInverse }]}>{opt.label}</Text>
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
  container: { flex: 1 },
  content: { padding: 20 },
  sectionLabel: { fontSize: 13, fontWeight: "700", marginBottom: 10, marginTop: 8, letterSpacing: 0.3, textTransform: "uppercase" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 16, gap: 8 },
  chip: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, gap: 6 },
  chipText: { fontSize: 13, fontWeight: "600" },
  catDot: { width: 8, height: 8, borderRadius: 4 },
});
