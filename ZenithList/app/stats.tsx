import { View, Text, ScrollView, useColorScheme, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTaskStore } from "../src/stores/taskStore";
import { useCategoryStore } from "../src/stores/categoryStore";
import { useSettingsStore } from "../src/stores/settingsStore";
import { Colors } from "../src/utils/theme";

export default function StatsScreen() {
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useCategoryStore((s) => s.categories);
  const colorScheme = useColorScheme();
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === "dark" || (theme === "system" && colorScheme === "dark");
  const c = isDark ? Colors.dark : Colors.light;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completedAt).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const today = new Date().toISOString().split("T")[0];
  const doneToday = tasks.filter((t) => t.completedAt?.startsWith(today)).length;

  const highP = tasks.filter((t) => t.priority === "high" && !t.completedAt).length;
  const medP = tasks.filter((t) => t.priority === "medium" && !t.completedAt).length;
  const lowP = tasks.filter((t) => t.priority === "low" && !t.completedAt).length;

  const catStats = categories.map((ch) => ({
    name: ch.name, color: ch.color,
    total: tasks.filter((t) => t.categoryId === ch.id).length,
    done: tasks.filter((t) => t.categoryId === ch.id && t.completedAt).length,
  }));

  return (
    <ScrollView style={[styles.container, { backgroundColor: c.surface }]} contentContainerStyle={styles.content}>
      <View style={[styles.heroCard, { backgroundColor: c.card, borderColor: c.borderLight }]}>
        <View style={[styles.heroIcon, { backgroundColor: c.warningLight }]}><Ionicons name="trophy" size={28} color={c.warning} /></View>
        <Text style={[styles.heroRate, { color: c.text }]}>{completionRate}%</Text>
        <Text style={[styles.heroLabel, { color: c.textSecondary }]}>Completion Rate</Text>
        <View style={[styles.heroBar, { backgroundColor: c.surfaceHover }]}>
          <View style={[styles.heroBarFill, { backgroundColor: c.primary, width: `${completionRate}%` }]} />
        </View>
      </View>

      <View style={styles.grid}>
        <View style={[styles.statCard, { backgroundColor: c.infoLight }]}>
          <Ionicons name="document-text" size={20} color={c.info} />
          <Text style={[styles.statNum, { color: c.info }]}>{totalTasks}</Text>
          <Text style={[styles.statLabel, { color: c.textSecondary }]}>Total</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: c.successLight }]}>
          <Ionicons name="checkmark-circle" size={20} color={c.success} />
          <Text style={[styles.statNum, { color: c.success }]}>{completedTasks}</Text>
          <Text style={[styles.statLabel, { color: c.textSecondary }]}>Done</Text>
        </View>
      </View>
      <View style={styles.grid}>
        <View style={[styles.statCard, { backgroundColor: c.warningLight }]}>
          <Ionicons name="hourglass" size={20} color={c.warning} />
          <Text style={[styles.statNum, { color: c.warning }]}>{pendingTasks}</Text>
          <Text style={[styles.statLabel, { color: c.textSecondary }]}>Pending</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: c.purpleLight }]}>
          <Ionicons name="flash" size={20} color={c.purple} />
          <Text style={[styles.statNum, { color: c.purple }]}>{doneToday}</Text>
          <Text style={[styles.statLabel, { color: c.textSecondary }]}>Done Today</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: c.textDark }]}>Priority Breakdown</Text>
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.borderLight }]}>
        {[{ label: "High", color: c.high, count: highP, icon: "alert-circle" as const },
          { label: "Medium", color: c.medium, count: medP, icon: "remove" as const },
          { label: "Low", color: c.low, count: lowP, icon: "arrow-down" as const },
        ].map((p) => (
          <View key={p.label} style={styles.breakRow}>
            <Ionicons name={p.icon} size={18} color={p.color} />
            <Text style={[styles.breakLabel, { color: c.text }]}>{p.label}</Text>
            <Text style={[styles.breakValue, { color: c.text }]}>{p.count}</Text>
          </View>
        ))}
      </View>

      {catStats.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: c.textDark }]}>By Category</Text>
          <View style={[styles.card, { backgroundColor: c.card, borderColor: c.borderLight }]}>
            {catStats.map((ch) => (
              <View key={ch.name} style={styles.breakRow}>
                <Ionicons name="folder" size={18} color={ch.color} />
                <Text style={[styles.breakLabel, { color: c.text }]}>{ch.name}</Text>
                <Text style={[styles.breakValue, { color: c.text }]}>{ch.done}/{ch.total}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  heroCard: { borderRadius: 20, padding: 28, alignItems: "center", marginBottom: 20, borderWidth: 1 },
  heroIcon: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  heroRate: { fontSize: 44, fontWeight: "800", letterSpacing: -1 },
  heroLabel: { fontSize: 14, fontWeight: "500", marginBottom: 16 },
  heroBar: { width: "100%", height: 6, borderRadius: 3 },
  heroBarFill: { height: 6, borderRadius: 3 },
  grid: { flexDirection: "row", gap: 12, marginBottom: 12 },
  statCard: { flex: 1, borderRadius: 16, padding: 18, alignItems: "center" },
  statNum: { fontSize: 28, fontWeight: "800", marginTop: 6, letterSpacing: -0.5 },
  statLabel: { fontSize: 12, fontWeight: "600", marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 },
  sectionTitle: { fontSize: 14, fontWeight: "700", marginBottom: 12, marginTop: 8, letterSpacing: 0.3, textTransform: "uppercase" },
  card: { borderRadius: 16, padding: 18, borderWidth: 1 },
  breakRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, gap: 10 },
  breakLabel: { fontSize: 15, fontWeight: "500", flex: 1 },
  breakValue: { fontSize: 15, fontWeight: "700" },
});
