import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useTaskStore } from "../../src/stores/taskStore";
import { useCategoryStore } from "../../src/stores/categoryStore";
import { useSettingsStore } from "../../src/stores/settingsStore";
import { Input } from "../../src/components/Input";
import { Button } from "../../src/components/Button";
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
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <View style={styles.content}>
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

          <Text style={styles.sectionLabel}>Priority</Text>
          <View style={styles.optionRow}>
            {PRIORITIES.map((p) => (
              <Pressable
                key={p}
                onPress={() => setPriority(p)}
                style={[styles.optionBtn, priority === p && styles.optionBtnActive]}
              >
                <Text style={[styles.optionText, priority === p && styles.optionTextActive]}>
                  {p}
                </Text>
              </Pressable>
            ))}
          </View>

          {categories.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>Category</Text>
              <View style={styles.optionWrap}>
                {categories.map((cat) => (
                  <Pressable
                    key={cat.id}
                    onPress={() => setCategoryId(categoryId === cat.id ? null : cat.id)}
                    style={[styles.categoryBtn, categoryId === cat.id && styles.categoryBtnActive]}
                  >
                    <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                    <Text style={[styles.optionText, categoryId === cat.id && styles.optionTextActive]}>
                      {cat.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}

          <Text style={styles.sectionLabel}>Recurrence</Text>
          <View style={styles.optionWrap}>
            {RECURRENCE_OPTIONS.map((opt) => (
              <Pressable
                key={opt.label}
                onPress={() => {
                  setRecurrenceType(opt.value);
                  setIsRecurring(!!opt.value);
                }}
                style={[styles.optionBtn, recurrenceType === opt.value && styles.optionBtnActive]}
              >
                <Text style={[styles.optionText, recurrenceType === opt.value && styles.optionTextActive]}>
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Button title="Create Task" onPress={handleSave} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  content: { padding: 16 },
  sectionLabel: { fontSize: 14, fontWeight: "500", color: "#374151", marginBottom: 8 },
  optionRow: { flexDirection: "row", marginBottom: 24 },
  optionWrap: { flexDirection: "row", flexWrap: "wrap", marginBottom: 24 },
  optionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#f3f4f6",
  },
  optionBtnActive: { backgroundColor: "#2563eb" },
  optionText: { fontWeight: "500", color: "#6b7280" },
  optionTextActive: { color: "#ffffff" },
  categoryBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#f3f4f6",
  },
  categoryBtnActive: { backgroundColor: "#2563eb" },
  catDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
});
