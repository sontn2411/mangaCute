
import { Skeleton as MotiSkeleton } from 'moti/skeleton'
import React from 'react'
import { DimensionValue, View, ViewStyle } from 'react-native'

interface SkeletonProps {
    width?: DimensionValue
    height?: DimensionValue
    radius?: number | 'round'
    colorMode?: 'light' | 'dark'
    style?: ViewStyle
}

export default function Skeleton({
    width = '100%',
    height = 20,
    radius = 8,
    colorMode = 'light',
    style
}: SkeletonProps) {
    return (
        <MotiSkeleton
            width={width}
            height={height}
            radius={radius}
            colorMode={colorMode}
            backgroundColor={colorMode === 'dark' ? '#1c1c1e' : '#f0f0f0'}
        />
    )
}

export function HomeSkeleton() {
    return (
        <View className="flex-1 bg-white dark:bg-black pt-12 px-5">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
                <View>
                    <Skeleton width={100} height={14} style={{ marginBottom: 6 }} />
                    <Skeleton width={180} height={32} />
                </View>
                <Skeleton width={40} height={40} radius="round" />
            </View>

            {/* Featured */}
            <View className="mb-8">
                <Skeleton width={120} height={20} style={{ marginBottom: 12 }} />
                <View className="flex-row">
                    <View className="mr-5">
                        <Skeleton width={280} height={180} radius={24} />
                    </View>
                </View>
            </View>

            {/* Categories */}
            <View className="flex-row mb-8">
                {[1, 2, 3, 4].map(i => (
                    <View key={i} className="mr-3">
                        <Skeleton width={80} height={40} radius={16} />
                    </View>
                ))}
            </View>

            {/* List */}
            <View>
                <Skeleton width={120} height={20} style={{ marginBottom: 16 }} />
                <View className="flex-row justify-between">
                    <View className="w-[48%]">
                        <Skeleton width="100%" height={200} radius={12} style={{ marginBottom: 8 }} />
                        <Skeleton width="90%" height={16} style={{ marginBottom: 4 }} />
                        <Skeleton width="60%" height={12} />
                    </View>
                    <View className="w-[48%]">
                        <Skeleton width="100%" height={200} radius={12} style={{ marginBottom: 8 }} />
                        <Skeleton width="90%" height={16} style={{ marginBottom: 4 }} />
                        <Skeleton width="60%" height={12} />
                    </View>
                </View>
            </View>
        </View>
    )
}
