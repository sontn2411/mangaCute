
import { useDownloads } from '@/hooks/useDownloads'
import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function DownloadsScreen() {
    const downloads = useDownloads(state => state.downloads)
    const removeDownload = useDownloads(state => state.removeDownload)
    const router = useRouter()

    // Group downloads by Manga
    const groupedDownloads = useMemo(() => {
        const groups: Record<string, { mangaId: string, chapters: any[] }> = {}

        Object.values(downloads).forEach(dl => {
            if (!groups[dl.mangaId]) {
                groups[dl.mangaId] = {
                    mangaId: dl.mangaId,
                    chapters: []
                }
            }
            groups[dl.mangaId].chapters.push(dl)
        })

        return Object.values(groups)
    }, [downloads])

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black px-4">
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex-row items-center justify-between mb-4 mt-2">
                <Text className="text-3xl font-black text-black dark:text-white tracking-tight">Downloads</Text>
            </View>

            {groupedDownloads.length === 0 ? (
                <View className="flex-1 justify-center items-center opacity-50">
                    <Ionicons name="cloud-offline-outline" size={80} color="#ccc" />
                    <Text className="text-gray-400 mt-4 text-center text-lg font-medium">No downloads yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={groupedDownloads}
                    keyExtractor={item => item.mangaId}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View className="mb-6 bg-gray-50 dark:bg-zinc-900 rounded-2xl p-4">
                            {/* Ideally we would have Manga Name here, but we only stored ID. 
                                 We might need to fetch it or store it in useDownloads.
                                 For now, let's list chapters. 
                                 Actually, store should save Manga Name too for this UI. 
                                 I'll update store later. For now, let's show Chapter Count.
                             */}
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="font-bold text-lg text-black dark:text-white">
                                    Manga ID: {item.mangaId.substring(0, 8)}...
                                </Text>
                                <Text className="text-xs text-red-500 font-bold bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded-full">
                                    {item.chapters.length} Chapters
                                </Text>
                            </View>

                            {item.chapters.map(chapter => (
                                <View key={chapter.chapterId} className="flex-row justify-between items-center py-3 border-t border-gray-200 dark:border-zinc-800">
                                    <TouchableOpacity
                                        className="flex-1"
                                        onPress={() => router.push({
                                            pathname: '/chapter/[id]',
                                            params: { id: chapter.chapterId }
                                        })}
                                    >
                                        <Text className="font-semibold text-gray-700 dark:text-gray-300">
                                            Chapter {chapter.chapterName}
                                        </Text>
                                        <Text className="text-xs text-gray-400">
                                            {chapter.status === 'completed' ? 'Downloaded' : `${chapter.progress}%`}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => removeDownload(chapter.chapterId)}>
                                        <Ionicons name="trash-outline" size={20} color="#FF5555" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    )
}
