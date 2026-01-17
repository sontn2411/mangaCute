import CustomTabBar from '@/components/layout/CustomTabBar'
import { Tabs } from 'expo-router'
import React from 'react'

export default function TabLayout() {
  return (
    // <Tabs
    //   screenOptions={{
    //     headerShown: false,
    //     tabBarShowLabel: true,
    //     tabBarActiveTintColor: '#FF6F9C',
    //     tabBarInactiveTintColor: '#F8AFC2',
    //     tabBarStyle: {
    //       position: 'absolute',
    //       bottom: 20,
    //       left: 20,
    //       right: 20,
    //       height: 80,

    //       backgroundColor: '#FFFFFF',
    //       borderRadius: 30,

    //       // shadow iOS
    //       shadowColor: '#000',
    //       shadowOffset: { width: 0, height: 8 },
    //       shadowOpacity: 0.1,
    //       shadowRadius: 10,

    //       // shadow Android
    //       elevation: 10,
    //     },
    //     tabBarLabelStyle: {
    //       fontSize: 12,
    //       fontWeight: '600',
    //       marginTop: 6,
    //     },
    //     tabBarItemStyle: {
    //       paddingVertical: 10,
    //     },
    //   }}
    // >
    //   <Tabs.Screen
    //     name='index'
    //     options={{
    //       title: 'Home',
    //       tabBarIcon: ({ color }) => (
    //         <IconSymbol size={28} name='house.fill' color={color} />
    //       ),
    //     }}
    //   />
    //   <Tabs.Screen
    //     name='explore'
    //     options={{
    //       title: 'Explore',
    //       tabBarIcon: ({ color }) => (
    //         <IconSymbol size={28} name='paperplane.fill' color={color} />
    //       ),
    //     }}
    //   />
    // </Tabs>

    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name='index' options={{ title: 'Home' }} />
      <Tabs.Screen name='explore' options={{ title: 'Explore' }} />
      <Tabs.Screen name='favorites' options={{ title: 'Favorites' }} />
      <Tabs.Screen name='downloads' options={{ title: 'Downloads' }} />
    </Tabs>
  )
}
