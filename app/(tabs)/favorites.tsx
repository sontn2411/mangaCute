
import MangaCard from '@/components/MangaCard'
import { useFavorites } from '@/hooks/useFavorites'
import { Ionicons } from '@expo/vector-icons'
import { Link, Stack } from 'expo-router'
import React from 'react'
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'

export default function FavoritesScreen() {
    const { favorites } = useFavorites()

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <Stack.Screen options={{ headerShown: false }} />

            <View className="px-5 py-4 border-b border-gray-100 dark:border-gray-900">
                <Text className="text-3xl font-black text-black dark:text-white tracking-tight">Favorites</Text>
                <Text className="text-gray-500 text-sm font-medium mt-1">{favorites.length} saved manga</Text>
            </View>

            <FlatList
                data={favorites}
                keyExtractor={(item) => item._id}
                numColumns={2}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View className="mb-6 w-[48%]">
                        <MangaCard manga={item} />
                    </View>
                )}
                ListEmptyComponent={
                    <View className="items-center justify-center py-32 px-10">
                        <View className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-full items-center justify-center mb-4">
                            <Ionicons name="heart-outline" size={40} color="#FF5555" />
                        </View>
                        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Favorites Yet</Text>
                        <Text className="text-gray-500 text-center leading-5">
                            Tap the heart icon on any manga detail page to save it here for later.
                        </Text>
                        <Link href="/(tabs)/explore" asChild>
                            <TouchableOpacity className="mt-6 bg-black dark:bg-white px-6 py-3 rounded-full">
                                <Text className="text-white dark:text-black font-bold">Go Explore</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                }
            />
        </SafeAreaView>
    )
}
