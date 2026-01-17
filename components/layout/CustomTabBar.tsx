
import { IconSymbol } from '@/components/ui/icon-symbol'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
  onLongPress
}: {
  route: any,
  isFocused: boolean,
  onPress: () => void,
  onLongPress: () => void
}) {
  // Bouncier spring for Kawaii feel
  const scale = useDerivedValue(() => {
    return withSpring(isFocused ? 1.3 : 1, { damping: 8, stiffness: 150 })
  })

  const labelStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isFocused ? 1 : 0, { duration: 200 }),
      transform: [{ translateY: withSpring(isFocused ? 0 : 10) }],
    }
  })

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { translateY: withSpring(isFocused ? -8 : 0) }]
    }
  })

  const iconName = TAB_ICONS[route.name] || 'house.fill'
  const activeColor = '#FF7A9A'
  const inactiveColor = '#D1C4E9'

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
          size={28}
          color={isFocused ? activeColor : inactiveColor}
        />
      </Animated.View>
      <Animated.View style={[styles.labelContainer, labelStyle]}>
        <Text style={[styles.label, { color: activeColor }]}>
          {TAB_LABELS[route.name] || route.name}
        </Text>
      </Animated.View>
      {isFocused && (
        <Animated.View
          entering={undefined}
          style={{
            position: 'absolute',
            bottom: 4,
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

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 15 }]}>
      <View style={styles.shadowLayer} />
      <View style={styles.blurWrapper}>
        <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
        {/* Pink Gradient Overlay for that "Candy" look */}
        <LinearGradient
          colors={['rgba(255, 235, 238, 0.9)', 'rgba(255, 255, 255, 0.95)']}
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
    backgroundColor: '#FF9EB5',
    opacity: 0.3,
    transform: [{ translateY: 5 }],
  },
  blurWrapper: {
    width: Dimensions.get('window').width - 40,
    height: 75,
    borderRadius: 40, // Super rounded
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFF0F5',
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
    bottom: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: '800', // Thicker font
    textTransform: 'uppercase', // Cute small caps
    letterSpacing: 0.5,
  }
})
