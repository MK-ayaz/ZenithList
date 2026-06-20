import { View, Text, useColorScheme, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useSettingsStore } from "../src/stores/settingsStore";
import { Colors } from "../src/utils/theme";

export default function NotFoundScreen() {
  const colorScheme = useColorScheme();
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === "dark" || (theme === "system" && colorScheme === "dark");
  const c = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: c.surface }]}>
      <View style={[styles.iconBg, { backgroundColor: c.surfaceHover }]}><Ionicons name="alert-circle" size={40} color={c.textMuted} /></View>
      <Text style={[styles.title, { color: c.text }]}>Page Not Found</Text>
      <Text style={[styles.desc, { color: c.textSecondary }]}>This screen doesn't exist</Text>
      <Link href="/" style={[styles.link, { backgroundColor: c.primary }]}>
        <Ionicons name="home" size={18} color={c.textInverse} />
        <Text style={[styles.linkText, { color: c.textInverse }]}>Go Home</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
  iconBg: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  desc: { fontSize: 15, marginBottom: 28 },
  link: { paddingHorizontal: 28, paddingVertical: 14, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 8 },
  linkText: { fontWeight: "700", fontSize: 15 },
});
