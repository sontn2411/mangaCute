
import { Link } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface SectionHeaderProps {
    title: string
    href?: string
}

export default function SectionHeader({ title, href }: SectionHeaderProps) {
    return (
        <View className="flex-row justify-between items-center px-4 py-3 bg-transparent">
            <View className="flex-row items-center">
                <View className="w-1 h-6 bg-red-500 mr-2 rounded-full" />
                <Text className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">{title}</Text>
            </View>
            {href && (
                <Link href={href as any} asChild>
                    <TouchableOpacity>
                        <Text className="text-sm font-semibold text-red-500">View All</Text>
                    </TouchableOpacity>
                </Link>
            )}
        </View>
    )
}
