import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTaskStore } from "../src/stores/taskStore";
import { useCategoryStore } from "../src/stores/categoryStore";

export default function StatsScreen() {
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useCategoryStore((s) => s.categories);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completedAt).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const today = new Date().toISOString().split("T")[0];
  const doneToday = tasks.filter((t) => t.completedAt?.startsWith(today)).length;
  const createdToday = tasks.filter((t) => t.createdAt.startsWith(today)).length;

  const highP = tasks.filter((t) => t.priority === "high" && !t.completedAt).length;
  const medP = tasks.filter((t) => t.priority === "medium" && !t.completedAt).length;
  const lowP = tasks.filter((t) => t.priority === "low" && !t.completedAt).length;

  const catStats = categories.map((c) => ({
    name: c.name, color: c.color,
    total: tasks.filter((t) => t.categoryId === c.id).length,
    done: tasks.filter((t) => t.categoryId === c.id && t.completedAt).length,
  }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <View style={styles.heroIcon}><Ionicons name="trophy" size={28} color="#f59e0b" /></View>
        <Text style={styles.heroRate}>{completionRate}%</Text>
        <Text style={styles.heroLabel}>Completion Rate</Text>
        <View style={styles.heroBar}>
          <View style={[styles.heroBarFill, { width: `${completionRate}%` }]} />
        </View>
      </View>

      <View style={styles.grid}>
        <View style={[styles.statCard, { backgroundColor: "#eff6ff" }]}>
          <Ionicons name="document-text" size={20} color="#3b82f6" />
          <Text style={[styles.statNum, { color: "#3b82f6" }]}>{totalTasks}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#f0fdf4" }]}>
          <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
          <Text style={[styles.statNum, { color: "#22c55e" }]}>{completedTasks}</Text>
          <Text style={styles.statLabel}>Done</Text>
        </View>
      </View>
      <View style={styles.grid}>
        <View style={[styles.statCard, { backgroundColor: "#fffbeb" }]}>
          <Ionicons name="hourglass" size={20} color="#f59e0b" />
          <Text style={[styles.statNum, { color: "#f59e0b" }]}>{pendingTasks}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#f5f3ff" }]}>
          <Ionicons name="flash" size={20} color="#8b5cf6" />
          <Text style={[styles.statNum, { color: "#8b5cf6" }]}>{doneToday}</Text>
          <Text style={styles.statLabel}>Done Today</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Priority Breakdown</Text>
      <View style={styles.card}>
        {[{ label: "High", color: "#ef4444", count: highP, icon: "alert-circle" as const },
          { label: "Medium", color: "#f59e0b", count: medP, icon: "remove" as const },
          { label: "Low", color: "#3b82f6", count: lowP, icon: "arrow-down" as const },
        ].map((p) => (
          <View key={p.label} style={styles.breakRow}>
            <Ionicons name={p.icon} size={18} color={p.color} />
            <Text style={styles.breakLabel}>{p.label}</Text>
            <Text style={styles.breakValue}>{p.count}</Text>
          </View>
        ))}
      </View>

      {catStats.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>By Category</Text>
          <View style={styles.card}>
            {catStats.map((c) => (
              <View key={c.name} style={styles.breakRow}>
                <Ionicons name="folder" size={18} color={c.color} />
                <Text style={styles.breakLabel}>{c.name}</Text>
                <Text style={styles.breakValue}>{c.done}/{c.total}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 16 },
  heroCard: { backgroundColor: "#ffffff", borderRadius: 20, padding: 28, alignItems: "center", marginBottom: 20, borderWidth: 1, borderColor: "#f1f5f9" },
  heroIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#fffbeb", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  heroRate: { fontSize: 44, fontWeight: "800", color: "#0f172a", letterSpacing: -1 },
  heroLabel: { fontSize: 14, color: "#64748b", fontWeight: "500", marginBottom: 16 },
  heroBar: { width: "100%", height: 6, backgroundColor: "#f1f5f9", borderRadius: 3 },
  heroBarFill: { height: 6, backgroundColor: "#6366f1", borderRadius: 3 },
  grid: { flexDirection: "row", gap: 12, marginBottom: 12 },
  statCard: { flex: 1, borderRadius: 16, padding: 18, alignItems: "center" },
  statNum: { fontSize: 28, fontWeight: "800", marginTop: 6, letterSpacing: -0.5 },
  statLabel: { fontSize: 12, color: "#64748b", fontWeight: "600", marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#475569", marginBottom: 12, marginTop: 8, letterSpacing: 0.3, textTransform: "uppercase" },
  card: { backgroundColor: "#ffffff", borderRadius: 16, padding: 18, borderWidth: 1, borderColor: "#f1f5f9" },
  breakRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, gap: 10 },
  breakLabel: { fontSize: 15, color: "#0f172a", fontWeight: "500", flex: 1 },
  breakValue: { fontSize: 15, fontWeight: "700", color: "#0f172a" },
});
