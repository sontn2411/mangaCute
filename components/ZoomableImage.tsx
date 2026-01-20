
import { ImageStyle } from 'expo-image'
import React from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated'

interface ZoomableImageProps {
    uri: string
    width: number
    height: number
    style?: ImageStyle
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export default function ZoomableImage({ uri, width, height, style }: ZoomableImageProps) {
    const scale = useSharedValue(1)
    const focalX = useSharedValue(0)
    const focalY = useSharedValue(0)
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)

    const pinch = Gesture.Pinch()
        .onUpdate((event) => {
            scale.value = event.scale
            focalX.value = event.focalX
            focalY.value = event.focalY
        })
        .onEnd(() => {
            if (scale.value < 1) {
                scale.value = withSpring(1)
            }
        })

    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {
            if (scale.value > 1.5) {
                scale.value = withTiming(1)
                translateX.value = withTiming(0)
                translateY.value = withTiming(0)
            } else {
                scale.value = withSpring(2.5) // Zoom in
            }
        })

    // Composed Gesture
    // Note: Panning requires more complex logic to not conflict with FlatList. 
    // For "reading", usually simple Pinch to see detail and release/double tap is enough for basic usage.
    // If we want FULL google maps style pan/zoom in a FlatList, it's very hard natively.
    // Let's stick to simple Double Tap + Pinch.

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: focalX.value },
                { translateY: focalY.value },
                { translateX: -width / 2 },
                { translateY: -height / 2 },
                { scale: scale.value },
                { translateX: -focalX.value },
                { translateY: -focalY.value },
                { translateX: width / 2 },
                { translateY: height / 2 },
            ],
            // Ensure zIndex is high when zooming
            zIndex: scale.value > 1 ? 1000 : 1
        }
    })

    const centerStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }]
        }
    })

    return (
        <GestureDetector gesture={Gesture.Race(doubleTap, pinch)}>
            <Animated.View style={[styles.container, { width, height }]}>
                <Animated.Image
                    source={{ uri }}
                    style={[{ width, height }, centerStyle]}
                    resizeMode="contain"
                    // @ts-ignore
                    contentFit="contain" // Expo Image prop
                />
            </Animated.View>
        </GestureDetector>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden', // Clip to bounds or allow overflow?
        // Usually overflow visible is better for zoom
        zIndex: 1
    }
})
