import React from 'react';
import { View, Switch } from 'react-native';
import { useSettingsStore } from '../../store/settingsStore';
import { Typography, Card, Button } from '../../components/UI';

export default function SettingsScreen() {
  const { settings, setTheme, toggleNotifications } = useSettingsStore();

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark px-4 pt-12">
      <Typography variant="h1" className="mb-6">Settings</Typography>

      <Card className="mb-6 gap-4">
        <View className="flex-row justify-between items-center">
          <Typography variant="body">Dark Mode</Typography>
          <View className="flex-row gap-2">
            {['light', 'dark', 'system'].map(t => (
              <TouchableOpacity 
                key={t} 
                onPress={() => setTheme(t as any)}
                className={cn("px-3 py-1 rounded-lg border", settings.theme === t ? "bg-primary-500 border-primary-500 text-white" : "border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark")}
              >
                <Text className="text-xs capitalize">{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="flex-row justify-between items-center">
          <Typography variant="body">Notifications</Typography>
          <Switch 
            value={settings.notificationsEnabled} 
            onValueChange={toggleNotifications} 
          />
        </View>
      </Card>

      <Button 
        label="Export Data (JSON)" 
        onPress={() => alert('Exporting...')} 
        variant="secondary" 
        className="mb-4"
      />
      <Button 
        label="Import Data (JSON)" 
        onPress={() => alert('Importing...')} 
        variant="secondary" 
      />
    </View>
  );
}

import { TouchableOpacity, Text } from 'react-native';
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
