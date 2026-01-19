import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const TabIcon = ({ name, color, focused, badgeCount }: { name: any, color: string, focused: boolean, badgeCount?: number }) => {
  const scale = useSharedValue(1);
  useEffect(() => {
    if (focused) {
      scale.value = withSpring(1.2);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); 
    } else { scale.value = withSpring(1); }
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={animatedStyle}>
        <Ionicons name={name} size={24} color={color} />
      </Animated.View>
      {badgeCount && badgeCount > 0 && (
        <View style={styles.badge}><Text style={styles.badgeText}>{badgeCount}</Text></View>
      )}
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF8FA3', 
        tabBarInactiveTintColor: '#A0A0A0',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', marginTop: 2, marginBottom: Platform.OS === 'ios' ? 0 : 10 },
        tabBarStyle: { height: Platform.OS === 'ios' ? 92 : 75, backgroundColor: '#ffffff', borderTopColor: '#F5F5F5', paddingTop: 12 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Cửa Hàng', tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'home' : 'home-outline'} color={color} focused={focused} /> }} />
      <Tabs.Screen name="explore" options={{ title: 'Khám Phá', tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'grid' : 'grid-outline'} color={color} focused={focused} /> }} />
      <Tabs.Screen name="geminichat" options={{ title: 'Chat AI', tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'} color={color} focused={focused} /> }} />
      <Tabs.Screen name="mycart" options={{ title: 'Giỏ Hàng', tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'bag-handle' : 'bag-handle-outline'} color={color} focused={focused}/> }} />
      <Tabs.Screen name="account" options={{ title: 'Tài Khoản', tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'person' : 'person-outline'} color={color} focused={focused} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: { position: 'absolute', right: -10, top: -2, backgroundColor: '#181725', borderRadius: 10, minWidth: 16, height: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#FFF' },
  badgeText: { color: 'white', fontSize: 8, fontWeight: '900' },
});