import React from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export function Input({
  value, onChangeText, placeholder, label, error, multiline = false, numberOfLines = 1, iconName,
}: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputRow, multiline && styles.multilineRow, error && styles.inputError]}>
        {iconName && <Ionicons name={iconName} size={18} color="#94a3b8" style={styles.icon} />}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          multiline={multiline}
          numberOfLines={numberOfLines}
          style={[styles.input, multiline && styles.multiline]}
          placeholderTextColor="#94a3b8"
          textAlignVertical={multiline ? "top" : "center"}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: "#475569", marginBottom: 6, letterSpacing: 0.3 },
  inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#f8fafc", borderRadius: 12, borderWidth: 1, borderColor: "#e2e8f0" },
  multilineRow: { alignItems: "flex-start" },
  inputError: { borderColor: "#ef4444" },
  icon: { marginLeft: 12 },
  input: { flex: 1, paddingHorizontal: 12, paddingVertical: 12, fontSize: 15, color: "#0f172a" },
  multiline: { minHeight: 80, paddingTop: 12 },
  error: { color: "#ef4444", fontSize: 12, marginTop: 4 },
});
