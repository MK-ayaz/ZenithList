import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';



interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  isLoading, 
  disabled, 
  className = '' 
}) => {
  const variants = {
    primary: 'bg-primary-500',
    secondary: 'bg-slate-200 dark:bg-slate-800',
    danger: 'bg-red-500',
  };

  const textVariants = {
    primary: 'text-white',
    secondary: 'text-slate-900 dark:text-slate-100',
    danger: 'text-white',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`px-4 py-3 rounded-2xl flex-row justify-center items-center ${variants[variant]} ${className}`}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className={`font-semibold text-center ${textVariants[variant]}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
