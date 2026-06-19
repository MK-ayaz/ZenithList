import React from 'react';
import { TextInput, View, Text } from 'react-native';


interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
  secureTextEntry?: boolean;
}

export const Input: React.FC<InputProps> = ({ label, value, onChangeText, placeholder, className = '', secureTextEntry }) => {
  return (
    <View className="mb-4">
      {label && <Text className="text-slate-500 dark:text-slate-400 text-sm mb-1 ml-1">{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        className={`bg-slate-100 dark:bg-slate-900 px-4 py-3 rounded-2xl text-slate-900 dark:text-slate-100 ${className}`}
        placeholderTextColor="#94a3b8"
      />
    </View>
  );
};
