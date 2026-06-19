import React from "react";
import { Pressable, Text, ActivityIndicator } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { cn } from "../utils/cn";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className,
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

  const baseClasses = "rounded-xl items-center justify-center flex-row";
  const sizeClasses = {
    sm: "px-4 py-2",
    md: "px-6 py-3",
    lg: "px-8 py-4",
  };
  const variantClasses = {
    primary: "bg-primary-600",
    secondary: "bg-gray-100 dark:bg-gray-800",
    outline: "border border-gray-300 dark:border-gray-600",
    danger: "bg-red-500",
  };

  return (
    <AnimatedPressable
      style={[animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        disabled && "opacity-50",
        className
      )}
    >
      {loading && (
        <ActivityIndicator size="small" color="white" className="mr-2" />
      )}
      <Text
        className={cn(
          "font-semibold",
          size === "sm" && "text-sm",
          size === "md" && "text-base",
          size === "lg" && "text-lg",
          variant === "primary" && "text-white",
          variant === "secondary" && "text-gray-900 dark:text-white",
          variant === "outline" && "text-gray-900 dark:text-white",
          variant === "danger" && "text-white"
        )}
      >
        {title}
      </Text>
    </AnimatedPressable>
  );
}
