import React from "react";
import { Pressable, Text, ActivityIndicator, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  iconName?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  iconName,
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      style={[styles.base, styles[`s_${size}`], styles[`v_${variant}`], disabled && styles.disabled, animStyle, style]}
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }}
      onPressIn={() => { scale.value = withSpring(0.97); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === "primary" || variant === "danger" ? "#fff" : "#6366f1"} />
      ) : (
        <>
          {iconName && (
            <Ionicons
              name={iconName}
              size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
              color={variant === "primary" || variant === "danger" ? "#fff" : "#6366f1"}
              style={iconName ? { marginRight: 8 } : undefined}
            />
          )}
          <Text style={[styles.text, styles[`t_${size}`], styles[`tv_${variant}`]]}>{title}</Text>
        </>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 12, alignItems: "center", justifyContent: "center", flexDirection: "row" },
  s_sm: { paddingHorizontal: 14, paddingVertical: 8, minHeight: 32 },
  s_md: { paddingHorizontal: 20, paddingVertical: 12, minHeight: 44 },
  s_lg: { paddingHorizontal: 28, paddingVertical: 16, minHeight: 52 },
  v_primary: { backgroundColor: "#6366f1" },
  v_secondary: { backgroundColor: "#f1f5f9" },
  v_ghost: { backgroundColor: "transparent" },
  v_danger: { backgroundColor: "#ef4444" },
  disabled: { opacity: 0.5 },
  text: { fontWeight: "600" },
  t_sm: { fontSize: 13 },
  t_md: { fontSize: 15 },
  t_lg: { fontSize: 17 },
  tv_primary: { color: "#ffffff" },
  tv_secondary: { color: "#6366f1" },
  tv_ghost: { color: "#6366f1" },
  tv_danger: { color: "#ffffff" },
});
