import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { cn } from "../utils/cn";

interface FABProps {
  icon: string;
  onPress: () => void;
  className?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FAB({ icon, onPress, className }: FABProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[animatedStyle]}
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.9); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      className={cn(
        "absolute bottom-6 right-6 w-14 h-14 rounded-full bg-primary-600 items-center justify-center shadow-lg",
        className
      )}
    >
      <Text className="text-white text-2xl">{icon}</Text>
    </AnimatedPressable>
  );
}
