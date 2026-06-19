import { View, Text, ScrollView, Pressable, Switch, Alert, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSettingsStore } from "../src/stores/settingsStore";
import { useTaskStore } from "../src/stores/taskStore";
import { useCategoryStore } from "../src/stores/categoryStore";
import { ThemeMode, Priority } from "../src/types";

const THEMES: { label: string; value: ThemeMode; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: "Auto", value: "system", icon: "phone-portrait" },
  { label: "Light", value: "light", icon: "sunny" },
  { label: "Dark", value: "dark", icon: "moon" },
];
const PRIORITIES: { label: string; value: Priority }[] = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
  { label: "None", value: "none" },
];

export default function SettingsScreen() {
  const s = useSettingsStore();
  const tasks = useTaskStore((st) => st.tasks);
  const categories = useCategoryStore((st) => st.categories);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.section}>Appearance</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Theme</Text>
        <View style={styles.themeRow}>
          {THEMES.map((t) => (
            <Pressable key={t.value} onPress={() => { Haptics.selectionAsync(); s.updateTheme(t.value); }}
              style={[styles.themeBtn, s.theme === t.value && styles.themeBtnActive]}>
              <Ionicons name={t.icon} size={18} color={s.theme === t.value ? "#fff" : "#64748b"} />
              <Text style={[styles.themeText, s.theme === t.value && { color: "#fff" }]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Text style={styles.section}>Defaults</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Default Priority</Text>
        <View style={styles.themeRow}>
          {PRIORITIES.map((p) => (
            <Pressable key={p.value} onPress={() => { Haptics.selectionAsync(); s.updateDefaultPriority(p.value); }}
              style={[styles.themeBtn, s.defaultPriority === p.value && styles.themeBtnActive]}>
              <Text style={[styles.themeText, s.defaultPriority === p.value && { color: "#fff" }]}>{p.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Text style={styles.section}>Notifications</Text>
      <View style={styles.card}>
        <View style={styles.switchRow}>
          <View style={styles.switchLeft}>
            <Ionicons name="notifications" size={20} color="#64748b" />
            <Text style={styles.switchLabel}>Notifications</Text>
          </View>
          <Switch value={s.notificationsEnabled} onValueChange={(v) => { Haptics.selectionAsync(); s.updateNotificationsEnabled(v); }} trackColor={{ false: "#e2e8f0", true: "#6366f1" }} />
        </View>
        <View style={styles.divider} />
        <View style={styles.switchRow}>
          <View style={styles.switchLeft}>
            <Ionicons name="eye" size={20} color="#64748b" />
            <Text style={styles.switchLabel}>Show completed</Text>
          </View>
          <Switch value={s.showCompletedTasks} onValueChange={(v) => { Haptics.selectionAsync(); s.updateShowCompletedTasks(v); }} trackColor={{ false: "#e2e8f0", true: "#6366f1" }} />
        </View>
      </View>

      <Text style={styles.section}>Data</Text>
      <View style={styles.card}>
        <Pressable style={styles.dataAction} onPress={() => Alert.alert("Export", `${tasks.length} tasks, ${categories.length} categories. Available in production build.`)}>
          <Ionicons name="download-outline" size={20} color="#6366f1" />
          <Text style={{ color: "#6366f1", fontWeight: "600", fontSize: 15 }}>Export Data</Text>
        </Pressable>
        <View style={styles.divider} />
        <Pressable style={styles.dataAction} onPress={() => Alert.alert("Clear All", "Delete everything?", [{ text: "Cancel", style: "cancel" }, { text: "Clear", style: "destructive", onPress: () => { useTaskStore.setState({ tasks: [] }); useCategoryStore.setState({ categories: [] }); } }])}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
          <Text style={{ color: "#ef4444", fontWeight: "600", fontSize: 15 }}>Clear All Data</Text>
        </Pressable>
      </View>

      <Text style={styles.version}>ZenithList v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 16 },
  section: { fontSize: 12, fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, marginTop: 16 },
  card: { backgroundColor: "#ffffff", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#f1f5f9" },
  cardTitle: { fontSize: 15, fontWeight: "600", color: "#0f172a", marginBottom: 12 },
  themeRow: { flexDirection: "row", gap: 8 },
  themeBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 10, borderRadius: 10, backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#e2e8f0", gap: 6 },
  themeBtnActive: { backgroundColor: "#6366f1", borderColor: "#6366f1" },
  themeText: { fontSize: 13, fontWeight: "600", color: "#475569" },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 4 },
  switchLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  switchLabel: { fontSize: 15, fontWeight: "500", color: "#0f172a" },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 14 },
  dataAction: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4 },
  version: { textAlign: "center", color: "#cbd5e1", fontSize: 13, marginTop: 24, marginBottom: 40, fontWeight: "500" },
});
