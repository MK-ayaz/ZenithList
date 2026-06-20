import React from "react";
import { TextInput, View, Text, useColorScheme, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSettingsStore } from "../stores/settingsStore";
import { Colors } from "../utils/theme";

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
  const colorScheme = useColorScheme();
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === "dark" || (theme === "system" && colorScheme === "dark");
  const c = isDark ? Colors.dark : Colors.light;

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: c.textDark }]}>{label}</Text>}
      <View style={[styles.inputRow, { backgroundColor: c.surface, borderColor: c.border }, multiline && styles.multilineRow, error && { borderColor: c.danger }]}>
        {iconName && <Ionicons name={iconName} size={18} color={c.textTertiary} style={styles.icon} />}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          multiline={multiline}
          numberOfLines={numberOfLines}
          style={[styles.input, { color: c.text }, multiline && styles.multiline]}
          placeholderTextColor={c.textTertiary}
          textAlignVertical={multiline ? "top" : "center"}
        />
      </View>
      {error && <Text style={[styles.error, { color: c.danger }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6, letterSpacing: 0.3 },
  inputRow: { flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1 },
  multilineRow: { alignItems: "flex-start" },
  icon: { marginLeft: 12 },
  input: { flex: 1, paddingHorizontal: 12, paddingVertical: 12, fontSize: 15 },
  multiline: { minHeight: 80, paddingTop: 12 },
  error: { fontSize: 12, marginTop: 4 },
});
