import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useTaskStore } from "../src/stores/taskStore";
import { useCategoryStore } from "../src/stores/categoryStore";

export default function StatsScreen() {
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useCategoryStore((s) => s.categories);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completedAt).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const tasksCompletedToday = tasks.filter((t) => t.completedAt?.startsWith(new Date().toISOString().split("T")[0])).length;

  const highPriority = tasks.filter((t) => t.priority === "high" && !t.completedAt).length;
  const mediumPriority = tasks.filter((t) => t.priority === "medium" && !t.completedAt).length;
  const lowPriority = tasks.filter((t) => t.priority === "low" && !t.completedAt).length;

  const categoryStats = categories.map((cat) => ({
    name: cat.name,
    color: cat.color,
    total: tasks.filter((t) => t.categoryId === cat.id).length,
    completed: tasks.filter((t) => t.categoryId === cat.id && t.completedAt).length,
  }));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.rateCard}>
          <Text style={styles.rateNumber}>{completionRate}%</Text>
          <Text style={styles.rateLabel}>Completion Rate</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#111827" }]}>{totalTasks}</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#22c55e" }]}>{completedTasks}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#f59e0b" }]}>{pendingTasks}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#3b82f6" }]}>{tasksCompletedToday}</Text>
            <Text style={styles.statLabel}>Done Today</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Priority Breakdown</Text>
        <View style={styles.breakdownCard}>
          <View style={styles.breakdownRow}>
            <View style={[styles.breakdownDot, { backgroundColor: "#ef4444" }]} />
            <Text style={styles.breakdownLabel}>High</Text>
            <Text style={styles.breakdownValue}>{highPriority}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <View style={[styles.breakdownDot, { backgroundColor: "#f59e0b" }]} />
            <Text style={styles.breakdownLabel}>Medium</Text>
            <Text style={styles.breakdownValue}>{mediumPriority}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <View style={[styles.breakdownDot, { backgroundColor: "#3b82f6" }]} />
            <Text style={styles.breakdownLabel}>Low</Text>
            <Text style={styles.breakdownValue}>{lowPriority}</Text>
          </View>
        </View>

        {categoryStats.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>By Category</Text>
            <View style={styles.breakdownCard}>
              {categoryStats.map((stat) => (
                <View key={stat.name} style={styles.breakdownRow}>
                  <View style={[styles.breakdownDot, { backgroundColor: stat.color }]} />
                  <Text style={styles.breakdownLabel}>{stat.name}</Text>
                  <Text style={styles.breakdownValue}>{stat.completed}/{stat.total}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  content: { padding: 16 },
  rateCard: { backgroundColor: "#eff6ff", borderRadius: 16, padding: 24, marginBottom: 16, alignItems: "center" },
  rateNumber: { fontSize: 40, fontWeight: "bold", color: "#2563eb", marginBottom: 4 },
  rateLabel: { fontSize: 15, color: "#1e40af" },
  statsRow: { flexDirection: "row", marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: "#f9fafb", borderRadius: 12, padding: 16, marginHorizontal: 4 },
  statNumber: { fontSize: 24, fontWeight: "bold" },
  statLabel: { fontSize: 14, color: "#6b7280" },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#111827", marginBottom: 12, marginTop: 8 },
  breakdownCard: { backgroundColor: "#f9fafb", borderRadius: 12, padding: 16 },
  breakdownRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  breakdownDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  breakdownLabel: { fontSize: 15, color: "#374151", flex: 1 },
  breakdownValue: { fontSize: 15, fontWeight: "600", color: "#111827" },
});
