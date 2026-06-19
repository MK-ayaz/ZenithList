import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <MaterialIcons name="error-outline" size={64} color="#d1d5db" />
      <Text style={styles.title}>Page Not Found</Text>
      <Text style={styles.description}>This screen doesn't exist</Text>
      <Link href="/" style={styles.link}>
        <MaterialIcons name="home" size={20} color="#ffffff" />
        <Text style={styles.linkText}>Go Home</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#ffffff" },
  title: { fontSize: 20, fontWeight: "600", color: "#111827", marginBottom: 8, marginTop: 16 },
  description: { fontSize: 15, color: "#6b7280", marginBottom: 24 },
  link: { backgroundColor: "#2563eb", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, flexDirection: "row", alignItems: "center" },
  linkText: { color: "#ffffff", fontWeight: "600", marginLeft: 8 },
});
