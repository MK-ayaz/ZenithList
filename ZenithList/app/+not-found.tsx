import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconBg}><Ionicons name="alert-circle" size={40} color="#cbd5e1" /></View>
      <Text style={styles.title}>Page Not Found</Text>
      <Text style={styles.desc}>This screen doesn't exist</Text>
      <Link href="/" style={styles.link}>
        <Ionicons name="home" size={18} color="#fff" />
        <Text style={styles.linkText}>Go Home</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc", padding: 32 },
  iconBg: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#f1f5f9", alignItems: "center", justifyContent: "center", marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "700", color: "#0f172a", marginBottom: 8 },
  desc: { fontSize: 15, color: "#64748b", marginBottom: 28 },
  link: { backgroundColor: "#6366f1", paddingHorizontal: 28, paddingVertical: 14, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 8 },
  linkText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
