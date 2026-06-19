import { View, Text, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔍</Text>
      <Text style={styles.title}>Page Not Found</Text>
      <Text style={styles.description}>This screen doesn't exist</Text>
      <Link href="/" style={styles.link}>
        <Text style={styles.linkText}>Go Home</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#ffffff" },
  icon: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: "600", color: "#111827", marginBottom: 8 },
  description: { fontSize: 15, color: "#6b7280", marginBottom: 24 },
  link: { backgroundColor: "#2563eb", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  linkText: { color: "#ffffff", fontWeight: "600" },
});
