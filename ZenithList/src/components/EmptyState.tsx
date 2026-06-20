import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../utils/theme";

interface EmptyStateProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  color?: string;
  isDark?: boolean;
}

export function EmptyState({ iconName, title, description, color, isDark = false }: EmptyStateProps) {
  const c = isDark ? Colors.dark : Colors.light;
  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: c.surfaceHover }]}>
        <Ionicons name={iconName} size={40} color={color ?? c.textMuted} />
      </View>
      <Text style={[styles.title, { color: c.text }]}>{title}</Text>
      <Text style={[styles.description, { color: c.textSecondary }]}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, paddingVertical: 48 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "700", textAlign: "center", marginBottom: 8 },
  description: { fontSize: 14, textAlign: "center", lineHeight: 20 },
});
