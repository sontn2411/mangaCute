
import { IconSymbol } from '@/components/ui/icon-symbol'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import Animated, { useAnimatedStyle, useDerivedValue, withSpring, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Mapped icons configuration
const TAB_ICONS: Record<string, any> = {
  index: 'house.fill',
  explore: 'paperplane.fill',
  favorites: 'heart.fill',
  downloads: 'arrow.down.circle.fill',
}

const TAB_LABELS: Record<string, string> = {
  index: 'Home',
  explore: 'Explore',
  favorites: 'Favorites',
  downloads: 'Download',
}

function TabBarItem({
  route,
  isFocused,
  onPress,
  onLongPress,
  colorScheme
}: {
  route: any,
  isFocused: boolean,
  onPress: () => void,
  onLongPress: () => void,
  colorScheme: 'light' | 'dark' | null | undefined
}) {
  // Animation for icon scale
  const scale = useDerivedValue(() => {
    return withSpring(isFocused ? 1.2 : 1, { damping: 10, stiffness: 100 })
  })

  // Animation for label opacity/transform
  const labelStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isFocused ? 1 : 0, { duration: 200 }),
      transform: [{ translateY: withSpring(isFocused ? 0 : 10) }],
    }
  })

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { translateY: withSpring(isFocused ? -6 : 0) }]
    }
  })

  const iconName = TAB_ICONS[route.name] || 'house.fill'

  // Theme Colors
  const activeColor = colorScheme === 'dark' ? '#FF7A9A' : '#FF9EB5' // Primary / Primary Dark
  const inactiveColor = colorScheme === 'dark' ? '#6B7280' : '#D1C4E9'

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabItem}
      activeOpacity={0.7}
    >
      <Animated.View style={iconStyle}>
        <IconSymbol
          name={iconName}
          size={26}
          color={isFocused ? activeColor : inactiveColor}
        />
      </Animated.View>
      <Animated.View style={[styles.labelContainer, labelStyle]}>
        <Text style={[styles.label, { color: activeColor }]}>
          {TAB_LABELS[route.name] || route.name}
        </Text>
      </Animated.View>
      {/* Active Dot Indicator */}
      {isFocused && (
        <Animated.View
          entering={undefined}
          style={{
            position: 'absolute',
            bottom: 6,
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: activeColor
          }}
        />
      )}
    </TouchableOpacity>
  )
}

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
      {/* Shadow Layer */}
      <View style={[
        styles.shadowLayer,
        { backgroundColor: isDark ? '#403850' : '#FF9EB5', opacity: isDark ? 0.5 : 0.3 }
      ]} />

      <View style={[styles.blurWrapper, { borderColor: isDark ? '#2F2B3A' : '#FFF0F5' }]}>
        <BlurView intensity={isDark ? 60 : 80} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />

        {/* Gradient Overlay */}
        <LinearGradient
          colors={isDark
            ? ['rgba(47, 43, 58, 0.8)', 'rgba(26, 22, 37, 0.9)']
            : ['rgba(255, 235, 238, 0.8)', 'rgba(255, 255, 255, 0.9)']
          }
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.tabsContainer}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key]
            const isFocused = state.index === index

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              })

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params)
              }
            }

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              })
            }

            return (
              <TabBarItem
                key={route.key}
                route={route}
                isFocused={isFocused}
                onPress={onPress}
                onLongPress={onLongPress}
                colorScheme={colorScheme}
              />
            )
          })}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  shadowLayer: {
    position: 'absolute',
    bottom: 12,
    width: Dimensions.get('window').width - 48,
    height: 70,
    borderRadius: 40,
    transform: [{ translateY: 5 }],
  },
  blurWrapper: {
    width: Dimensions.get('window').width - 40,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    borderWidth: 1,
    elevation: 0,
  },
  tabsContainer: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  labelContainer: {
    position: 'absolute',
    bottom: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
  }
})
