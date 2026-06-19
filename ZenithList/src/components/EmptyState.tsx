import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface EmptyStateProps {
  iconName: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
}

export function EmptyState({ iconName, title, description }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <MaterialIcons name={iconName} size={64} color="#d1d5db" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, paddingVertical: 48 },
  title: { fontSize: 20, fontWeight: "600", color: "#111827", textAlign: "center", marginBottom: 8, marginTop: 16 },
  description: { fontSize: 15, color: "#6b7280", textAlign: "center" },
});
