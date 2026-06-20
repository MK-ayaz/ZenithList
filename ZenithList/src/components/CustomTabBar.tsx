import React, { useCallback } from "react";
import { View, Pressable, Text, StyleSheet, Platform } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../utils/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type TabKey = "today" | "upcoming" | "inbox" | "completed";

interface Tab {
  key: TabKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  badge?: number;
}

interface CustomTabBarProps {
  activeTab: TabKey;
  onTabPress: (key: TabKey) => void;
  tabs: Tab[];
  isDark: boolean;
}

function TabButton({
  tab,
  isActive,
  isDark,
  onPress,
}: {
  tab: Tab;
  isActive: boolean;
  isDark: boolean;
  onPress: () => void;
}) {
  const activeScale = useSharedValue(isActive ? 1 : 0);
  const labelOpacity = useSharedValue(isActive ? 1 : 0);

  React.useEffect(() => {
    activeScale.value = withTiming(isActive ? 1 : 0, {
      duration: 250,
      easing: Easing.out(Easing.cubic),
    });
    labelOpacity.value = withTiming(isActive ? 1 : 0, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
  }, [isActive]);

  const iconContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.88 + activeScale.value * 0.12 }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: 0.4 + labelOpacity.value * 0.6,
  }));

  const activeColor = isDark ? Colors.dark.tabActive : Colors.light.tabActive;
  const inactiveColor = isDark ? Colors.dark.tabInactive : Colors.light.tabInactive;
  const iconColor = isActive ? activeColor : inactiveColor;

  const iconName = isActive ? tab.activeIcon : tab.icon;

  const handlePress = useCallback(() => {
    Haptics.selectionAsync();
    onPress();
  }, [onPress]);

  return (
    <AnimatedPressable
      style={styles.tabButton}
      onPress={handlePress}
      hitSlop={{ top: 8, bottom: 8, left: 0, right: 0 }}
    >
      <Animated.View style={[styles.iconContainer, iconContainerStyle]}>
        <Ionicons name={iconName} size={24} color={iconColor} />
        {tab.badge != null && tab.badge > 0 && (
          <View style={[styles.badge, { backgroundColor: activeColor }]}>
            <Text style={styles.badgeText}>
              {tab.badge > 99 ? "99+" : tab.badge}
            </Text>
          </View>
        )}
      </Animated.View>
      <Animated.View style={labelStyle}>
        <Text
          style={[
            styles.tabLabel,
            { color: iconColor },
            isActive && styles.tabLabelActive,
          ]}
        >
          {tab.label}
        </Text>
      </Animated.View>
    </AnimatedPressable>
  );
}

export default function CustomTabBar({
  activeTab,
  onTabPress,
  tabs,
  isDark,
}: CustomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      <BlurView
        intensity={isDark ? 40 : 60}
        tint={isDark ? "dark" : "light"}
        style={styles.blur}
      />
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDark ? Colors.dark.tabBarBg : Colors.light.tabBarBg,
            borderTopColor: isDark ? Colors.dark.tabBarBorder : Colors.light.tabBarBorder,
          },
        ]}
      >
        <View style={styles.tabsRow}>
          {tabs.map((tab) => (
            <TabButton
              key={tab.key}
              tab={tab}
              isActive={activeTab === tab.key}
              isDark={isDark}
              onPress={() => onTabPress(tab.key)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  blur: {
    ...StyleSheet.absoluteFill,
  },
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabsRow: {
    flexDirection: "row",
    paddingTop: 6,
    paddingBottom: Platform.OS === "ios" ? 0 : 6,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 28,
    width: 28,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "500",
    marginTop: 2,
    letterSpacing: 0.1,
  },
  tabLabelActive: {
    fontWeight: "600",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "700",
    lineHeight: 14,
  },
});
