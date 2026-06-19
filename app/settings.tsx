import React from 'react';
import { View } from 'react-native';
import { styled } from 'nativewind';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';

const StyledView = styled(View);

export default function Page() {
  const { theme, setTheme, notificationsEnabled, toggleNotifications } = useStore();

  return (
    <StyledView className="flex-1 px-6 pt-4">
      <Card className="mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <View className="text-lg font-bold dark:text-white">Appearance</View>
            <View className="text-sm text-slate-500">Change app theme</View>
          </View>
          <Button 
            title={theme === 'light' ? 'Dark' : 'Light'} 
            onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
            variant="secondary" 
          />
        </View>
      </Card>

      <Card>
        <View className="flex-row justify-between items-center">
          <View>
            <View className="text-lg font-bold dark:text-white">Notifications</View>
            <View className="text-sm text-slate-500">Receive task reminders</View>
          </View>
          <Button 
            title={notificationsEnabled ? 'Off' : 'On'} 
            onPress={toggleNotifications} 
            variant={notificationsEnabled ? 'secondary' : 'primary'} 
          />
        </View>
      </Card>
    </StyledView>
  );
}
