import { View, Text, ScrollView, Pressable, Switch, Alert, useColorScheme, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSettingsStore } from "../src/stores/settingsStore";
import { useTaskStore } from "../src/stores/taskStore";
import { useCategoryStore } from "../src/stores/categoryStore";
import { ThemeMode, Priority } from "../src/types";
import { Colors } from "../src/utils/theme";

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
  const colorScheme = useColorScheme();
  const isDark = s.theme === "dark" || (s.theme === "system" && colorScheme === "dark");
  const c = isDark ? Colors.dark : Colors.light;

  return (
    <ScrollView style={[styles.container, { backgroundColor: c.surface }]} contentContainerStyle={styles.content}>
      <Text style={[styles.section, { color: c.textTertiary }]}>Appearance</Text>
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.borderLight }]}>
        <Text style={[styles.cardTitle, { color: c.text }]}>Theme</Text>
        <View style={styles.themeRow}>
          {THEMES.map((t) => (
            <Pressable key={t.value} onPress={() => { Haptics.selectionAsync(); s.updateTheme(t.value); }}
              style={[styles.themeBtn, { backgroundColor: c.surface, borderColor: c.border }, s.theme === t.value && { backgroundColor: c.primary, borderColor: c.primary }]}>
              <Ionicons name={t.icon} size={18} color={s.theme === t.value ? c.textInverse : c.textSecondary} />
              <Text style={[styles.themeText, { color: c.textDark }, s.theme === t.value && { color: c.textInverse }]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Text style={[styles.section, { color: c.textTertiary }]}>Defaults</Text>
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.borderLight }]}>
        <Text style={[styles.cardTitle, { color: c.text }]}>Default Priority</Text>
        <View style={styles.themeRow}>
          {PRIORITIES.map((p) => (
            <Pressable key={p.value} onPress={() => { Haptics.selectionAsync(); s.updateDefaultPriority(p.value); }}
              style={[styles.themeBtn, { backgroundColor: c.surface, borderColor: c.border }, s.defaultPriority === p.value && { backgroundColor: c.primary, borderColor: c.primary }]}>
              <Text style={[styles.themeText, { color: c.textDark }, s.defaultPriority === p.value && { color: c.textInverse }]}>{p.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Text style={[styles.section, { color: c.textTertiary }]}>Notifications</Text>
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.borderLight }]}>
        <View style={styles.switchRow}>
          <View style={styles.switchLeft}>
            <Ionicons name="notifications" size={20} color={c.textSecondary} />
            <Text style={[styles.switchLabel, { color: c.text }]}>Notifications</Text>
          </View>
          <Switch value={s.notificationsEnabled} onValueChange={(v) => { Haptics.selectionAsync(); s.updateNotificationsEnabled(v); }} trackColor={{ false: c.border, true: c.primary }} />
        </View>
        <View style={[styles.divider, { backgroundColor: c.borderLight }]} />
        <View style={styles.switchRow}>
          <View style={styles.switchLeft}>
            <Ionicons name="eye" size={20} color={c.textSecondary} />
            <Text style={[styles.switchLabel, { color: c.text }]}>Show completed</Text>
          </View>
          <Switch value={s.showCompletedTasks} onValueChange={(v) => { Haptics.selectionAsync(); s.updateShowCompletedTasks(v); }} trackColor={{ false: c.border, true: c.primary }} />
        </View>
      </View>

      <Text style={[styles.section, { color: c.textTertiary }]}>Data</Text>
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.borderLight }]}>
        <Pressable style={styles.dataAction} onPress={() => Alert.alert("Export", `${tasks.length} tasks, ${categories.length} categories. Available in production build.`)}>
          <Ionicons name="download-outline" size={20} color={c.primary} />
          <Text style={{ color: c.primary, fontWeight: "600", fontSize: 15 }}>Export Data</Text>
        </Pressable>
        <View style={[styles.divider, { backgroundColor: c.borderLight }]} />
        <Pressable style={styles.dataAction} onPress={() => Alert.alert("Clear All", "Delete everything?", [{ text: "Cancel", style: "cancel" }, { text: "Clear", style: "destructive", onPress: () => { useTaskStore.setState({ tasks: [] }); useCategoryStore.setState({ categories: [] }); } }])}>
          <Ionicons name="trash-outline" size={20} color={c.danger} />
          <Text style={{ color: c.danger, fontWeight: "600", fontSize: 15 }}>Clear All Data</Text>
        </Pressable>
      </View>

      <Text style={[styles.version, { color: c.textMuted }]}>ZenithList v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  section: { fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, marginTop: 16 },
  card: { borderRadius: 16, padding: 16, borderWidth: 1 },
  cardTitle: { fontSize: 15, fontWeight: "600", marginBottom: 12 },
  themeRow: { flexDirection: "row", gap: 8 },
  themeBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 10, borderRadius: 10, borderWidth: 1, gap: 6 },
  themeText: { fontSize: 13, fontWeight: "600" },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 4 },
  switchLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  switchLabel: { fontSize: 15, fontWeight: "500" },
  divider: { height: 1, marginVertical: 14 },
  dataAction: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4 },
  version: { textAlign: "center", fontSize: 13, marginTop: 24, marginBottom: 40, fontWeight: "500" },
});
