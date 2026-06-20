import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettingsStore } from "../stores/settingsStore";
import { useColorScheme } from "react-native";
import { Colors } from "../utils/theme";
import * as Haptics from "expo-haptics";

interface FABProps {
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FAB({ iconName, onPress }: FABProps) {
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const colorScheme = useColorScheme();
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === "dark" || (theme === "system" && colorScheme === "dark");
  const c = isDark ? Colors.dark : Colors.light;

  return (
    <AnimatedPressable
      style={[styles.container, { bottom: insets.bottom + 84, backgroundColor: c.primary, shadowColor: c.primary }, animStyle]}
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onPress(); }}
      onPressIn={() => { scale.value = withSpring(0.88); }}
      onPressOut={() => { scale.value = withSpring(1); }}
    >
      <Ionicons name={iconName} size={26} color={c.textInverse} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
});
