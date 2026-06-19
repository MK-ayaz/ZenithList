import { View, Text, ScrollView, Pressable, Switch, Alert, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSettingsStore } from "../src/stores/settingsStore";
import { useTaskStore } from "../src/stores/taskStore";
import { useCategoryStore } from "../src/stores/categoryStore";
import { ThemeMode, Priority } from "../src/types";

const THEME_OPTIONS: { label: string; value: ThemeMode; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { label: "System", value: "system", icon: "brightness-auto" },
  { label: "Light", value: "light", icon: "light-mode" },
  { label: "Dark", value: "dark", icon: "dark-mode" },
];

const PRIORITY_OPTIONS: { label: string; value: Priority }[] = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
  { label: "None", value: "none" },
];

const SORT_OPTIONS = [
  { label: "Due Date", value: "dueDate" as const, icon: "event" as const },
  { label: "Priority", value: "priority" as const, icon: "flag" as const },
  { label: "Created", value: "createdAt" as const, icon: "access-time" as const },
];

export default function SettingsScreen() {
  const settings = useSettingsStore();
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useCategoryStore((s) => s.categories);

  const handleExportData = () => {
    Alert.alert("Export Data", `You have ${tasks.length} tasks and ${categories.length} categories. Data export will be available in a production build.`, [{ text: "OK" }]);
  };

  const handleClearData = () => {
    Alert.alert("Clear All Data", "This will permanently delete all tasks and categories. Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: () => { useTaskStore.setState({ tasks: [] }); useCategoryStore.setState({ categories: [] }); } },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Theme</Text>
          <View style={styles.optionRow}>
            {THEME_OPTIONS.map((opt) => (
              <Pressable key={opt.value} onPress={() => settings.updateTheme(opt.value)} style={[styles.optionBtn, settings.theme === opt.value && styles.optionBtnActive]}>
                <MaterialIcons name={opt.icon} size={16} color={settings.theme === opt.value ? "#ffffff" : "#6b7280"} />
                <Text style={[styles.optionText, settings.theme === opt.value && styles.optionTextActive]}>{opt.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Defaults</Text>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Default Priority</Text>
          <View style={styles.optionRow}>
            {PRIORITY_OPTIONS.map((opt) => (
              <Pressable key={opt.value} onPress={() => settings.updateDefaultPriority(opt.value)} style={[styles.optionBtn, settings.defaultPriority === opt.value && styles.optionBtnActive]}>
                <Text style={[styles.optionText, settings.defaultPriority === opt.value && styles.optionTextActive]}>{opt.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Sorting</Text>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Sort By</Text>
          <View style={styles.optionRow}>
            {SORT_OPTIONS.map((opt) => (
              <Pressable key={opt.value} onPress={() => settings.updateSortBy(opt.value)} style={[styles.optionBtn, settings.sortBy === opt.value && styles.optionBtnActive]}>
                <MaterialIcons name={opt.icon} size={16} color={settings.sortBy === opt.value ? "#ffffff" : "#6b7280"} />
                <Text style={[styles.optionText, settings.sortBy === opt.value && styles.optionTextActive]}>{opt.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="notifications" size={20} color="#6b7280" style={{ marginRight: 8 }} />
              <Text style={styles.cardLabel}>Enable Notifications</Text>
            </View>
            <Switch value={settings.notificationsEnabled} onValueChange={settings.updateNotificationsEnabled} trackColor={{ false: "#d1d5db", true: "#3b82f6" }} />
          </View>
          <View style={styles.switchRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="visibility" size={20} color="#6b7280" style={{ marginRight: 8 }} />
              <Text style={styles.cardLabel}>Show Completed Tasks</Text>
            </View>
            <Switch value={settings.showCompletedTasks} onValueChange={settings.updateShowCompletedTasks} trackColor={{ false: "#d1d5db", true: "#3b82f6" }} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Data</Text>
        <View style={styles.card}>
          <Pressable onPress={handleExportData} style={styles.dataAction}>
            <MaterialIcons name="file-download" size={20} color="#2563eb" />
            <Text style={{ color: "#2563eb", fontWeight: "500", marginLeft: 8 }}>Export Data</Text>
          </Pressable>
          <View style={{ height: 1, backgroundColor: "#e5e7eb", marginVertical: 12 }} />
          <Pressable onPress={handleClearData} style={styles.dataAction}>
            <MaterialIcons name="delete-forever" size={20} color="#ef4444" />
            <Text style={{ color: "#ef4444", fontWeight: "500", marginLeft: 8 }}>Clear All Data</Text>
          </Pressable>
        </View>

        <Text style={styles.version}>ZenithList v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  content: { padding: 16 },
  sectionTitle: { fontSize: 13, fontWeight: "500", color: "#6b7280", textTransform: "uppercase", marginBottom: 12, marginTop: 8 },
  card: { backgroundColor: "#f9fafb", borderRadius: 12, padding: 16, marginBottom: 16 },
  cardLabel: { fontSize: 16, fontWeight: "500", color: "#111827" },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  optionRow: { flexDirection: "row", marginTop: 12 },
  optionBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginRight: 8, backgroundColor: "#e5e7eb" },
  optionBtnActive: { backgroundColor: "#2563eb" },
  optionText: { fontWeight: "500", color: "#6b7280", marginLeft: 4 },
  optionTextActive: { color: "#ffffff" },
  dataAction: { flexDirection: "row", alignItems: "center" },
  version: { textAlign: "center", color: "#9ca3af", fontSize: 14, marginBottom: 32, marginTop: 16 },
});
