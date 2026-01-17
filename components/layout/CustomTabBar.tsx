
import { IconSymbol } from '@/components/ui/icon-symbol'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { BlurView } from 'expo-blur'
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
  // Animation for icon scale
  const scale = useDerivedValue(() => {
    return withSpring(isFocused ? 1.2 : 1, { damping: 10, stiffness: 100 })
  })

  // Animation for label opacity/transform
  const labelStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isFocused ? 1 : 0, { duration: 200 }),
      transform: [{ translateY: withSpring(isFocused ? 0 : 10) }],
      // display: isFocused ? 'flex' : 'none' // optimize layout
    }
  })

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { translateY: withSpring(isFocused ? -6 : 0) }]
    }
  })

  const iconName = TAB_ICONS[route.name] || 'house.fill'

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
          color={isFocused ? '#FF5555' : '#aaa'}
        />
      </Animated.View>
      <Animated.View style={[styles.labelContainer, labelStyle]}>
        <Text style={styles.label}>
          {TAB_LABELS[route.name] || route.name}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  )
}

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
      <View style={styles.blurWrapper}>
        <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFill} />
        {/* Optional: Add a subtle gradient layer if needed, but blur is clean */}

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
    // Transparent container to allow content to show behind
  },
  blurWrapper: {
    width: Dimensions.get('window').width - 40,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.7)',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
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
    bottom: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FF5555',
  }
})
