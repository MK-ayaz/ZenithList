import React from "react";
import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      style={[
        styles.base,
        styles[`size_${size}`],
        styles[`variant_${variant}`],
        disabled && styles.disabled,
        animatedStyle,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
    >
      {loading && (
        <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
      )}
      <Text
        style={[
          styles.text,
          styles[`text_${size}`],
          variant === "primary" && styles.textWhite,
          variant === "danger" && styles.textWhite,
        ]}
      >
        {title}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  size_sm: { paddingHorizontal: 16, paddingVertical: 8 },
  size_md: { paddingHorizontal: 24, paddingVertical: 12 },
  size_lg: { paddingHorizontal: 32, paddingVertical: 16 },
  variant_primary: { backgroundColor: "#2563eb" },
  variant_secondary: { backgroundColor: "#f3f4f6" },
  variant_outline: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#d1d5db" },
  variant_danger: { backgroundColor: "#ef4444" },
  disabled: { opacity: 0.5 },
  text: { fontWeight: "600", color: "#111827" },
  text_sm: { fontSize: 14 },
  text_md: { fontSize: 16 },
  text_lg: { fontSize: 18 },
  textWhite: { color: "#ffffff" },
});
