import React from 'react';
import { TextInput, View, Text } from 'react-native';
import { styled } from 'nativewind';

const StyledTextInput = styled(TextInput);
const StyledView = styled(View);
const StyledText = styled(Text);

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
    <StyledView className="mb-4">
      {label && <StyledText className="text-slate-500 dark:text-slate-400 text-sm mb-1 ml-1">{label}</StyledText>}
      <StyledTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        className={`bg-slate-100 dark:bg-slate-900 px-4 py-3 rounded-2xl text-slate-900 dark:text-slate-100 ${className}`}
        placeholderTextColor="#94a3b8"
      />
    </StyledView>
  );
};
