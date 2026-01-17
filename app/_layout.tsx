import { useColorScheme } from '@/hooks/use-color-scheme'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'

import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'
import '../global.css'

export const unstable_settings = {
  anchor: '(tabs)',
}

import * as NavigationBar from 'expo-navigation-bar'
import { useEffect } from 'react'
import { Platform } from 'react-native'

export default function RootLayout() {
  const colorScheme = useColorScheme()

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden')
      NavigationBar.setBehaviorAsync('overlay-swipe')
      NavigationBar.setBackgroundColorAsync('#ffffff00')
    }
  }, [])

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen
          name='modal'
          options={{ presentation: 'modal', title: 'Modal' }}
        />
      </Stack>
      <StatusBar style='auto' />
    </ThemeProvider>
  )
}
