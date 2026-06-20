import React, { useRef } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, interpolate, Extrapolation } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Colors } from "../utils/theme";
import * as Haptics from "expo-haptics";

interface SwipeableRowProps {
  children: React.ReactNode;
  onComplete: () => void;
  onDelete: () => void;
  isDark?: boolean;
}

export function SwipeableRow({ children, onComplete, onDelete, isDark = false }: SwipeableRowProps) {
  const translateX = useSharedValue(0);
  const maxSwipe = -120;
  const c = isDark ? Colors.dark : Colors.light;

  const triggerComplete = () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); onComplete(); };
  const triggerDelete = () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); onDelete(); };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onUpdate((e) => {
      translateX.value = Math.max(maxSwipe, Math.min(0, e.translationX));
    })
    .onEnd(() => {
      if (translateX.value < maxSwipe * 0.6) {
        translateX.value = withTiming(maxSwipe);
        runOnJS(triggerDelete)();
      } else if (translateX.value < maxSwipe * 0.3) {
        translateX.value = withTiming(maxSwipe * 0.5);
        runOnJS(triggerComplete)();
      }
      translateX.value = withTiming(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const completeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [maxSwipe * 0.3, maxSwipe * 0.6], [0, 1], Extrapolation.CLAMP),
  }));

  const deleteOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [maxSwipe * 0.6, maxSwipe], [0, 1], Extrapolation.CLAMP),
  }));

  return (
    <View style={styles.container}>
      <View style={styles.actionsContainer}>
        <Animated.View style={[styles.action, { backgroundColor: c.success }, completeOpacity]}>
          <Ionicons name="checkmark-circle" size={24} color={c.textInverse} />
          <Text style={[styles.actionText, { color: c.textInverse }]}>Done</Text>
        </Animated.View>
        <Animated.View style={[styles.action, { backgroundColor: c.danger }, deleteOpacity]}>
          <Ionicons name="trash" size={24} color={c.textInverse} />
          <Text style={[styles.actionText, { color: c.textInverse }]}>Delete</Text>
        </Animated.View>
      </View>
      <Animated.View style={[styles.content, { backgroundColor: c.card }, animatedStyle]}>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  actionsContainer: { position: "absolute", top: 0, bottom: 0, right: 0, flexDirection: "row", borderRadius: 14, overflow: "hidden" },
  action: { width: 80, alignItems: "center", justifyContent: "center" },
  actionText: { fontSize: 11, fontWeight: "600", marginTop: 2 },
  content: { borderRadius: 14 },
});
