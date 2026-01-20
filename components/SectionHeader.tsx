
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
                <View className="w-1 h-6 bg-primary dark:bg-primary-dark mr-2 rounded-full" />
                <Text className="text-xl font-extrabold text-text dark:text-text-dark tracking-tight">{title}</Text>
            </View>
            {href && (
                <Link href={href as any} asChild>
                    <TouchableOpacity>
                        <Text className="text-sm font-semibold text-primary dark:text-primary-dark">View All</Text>
                    </TouchableOpacity>
                </Link>
            )}
        </View>
    )
}
