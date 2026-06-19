import { Tabs } from 'expo-router';
import { Inbox, Calendar, LayoutDashboard, Settings } from 'lucide-react-native';
import { useSettingsStore } from '../../store/settingsStore';

export default function TabsLayout() {
  const { settings } = useSettingsStore();
  const activeColor = '#3b82f6';
  const inactiveColor = settings.theme === 'dark' ? '#64748b' : '#94a3b8';

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: activeColor,
      tabBarInactiveTintColor: inactiveColor,
      tabBarStyle: {
        backgroundColor: settings.theme === 'dark' ? '#1e293b' : '#ffffff',
        borderTopWidth: 0,
        elevation: 0,
        height: 60,
        paddingBottom: 10,
      },
      headerShown: false,
    }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Inbox', 
          tabBarIcon: ({ color }) => <Inbox size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="upcoming" 
        options={{ 
          title: 'Upcoming', 
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="stats" 
        options={{ 
          title: 'Stats', 
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="settings" 
        options={{ 
          title: 'Settings', 
          tabBarIcon: ({ color }) => <Settings size={24} color={color} /> 
        }} 
      />
    </Tabs>
  );
}
