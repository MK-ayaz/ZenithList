import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { cn } from '../utils/cn'; // we need to create this

export const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <View className={cn("bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm", className)}>
    {children}
  </View>
);

export const Button = ({ 
  label, 
  onPress, 
  variant = 'primary', 
  className = '' 
}: { 
  label: string, 
  onPress: () => void, 
  variant?: 'primary' | 'secondary' | 'danger', 
  className?: string 
}) => {
  const variants = {
    primary: "bg-primary-500 text-white",
    secondary: "bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark",
    danger: "bg-red-500 text-white"
  };
  
  return (
    <TouchableOpacity 
      onPress={onPress} 
      className={cn("px-4 py-3 rounded-xl font-semibold text-center active:opacity-80", variants[variant], className)}
    >
      <Text className="text-center font-bold">{label}</Text>
    </TouchableOpacity>
  );
};

export const Typography = ({ 
  children, 
  variant = 'body', 
  className = '' 
}: { 
  children: React.ReactNode, 
  variant?: 'h1' | 'h2' | 'body' | 'caption', 
  className?: string 
}) => {
  const variants = {
    h1: "text-3xl font-bold text-text-light dark:text-text-dark",
    h2: "text-xl font-semibold text-text-light dark:text-text-dark",
    body: "text-base text-text-light dark:text-text-dark",
    caption: "text-sm text-gray-500 dark:text-gray-400"
  };
  
  return <Text className={cn(variants[variant], className)}>{children}</Text>;
};
