
import { useDownloads } from '@/hooks/useDownloads'
import { useChapter, useMangaDetail } from '@/hooks/useManga'
import { Ionicons } from '@expo/vector-icons'
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view'
import { Image } from 'expo-image'
import { Link, Stack, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { ActivityIndicator, Dimensions, FlatList, Text, TouchableOpacity, View } from 'react-native'

const { width } = Dimensions.get('window')

export default function ChapterReaderScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    // id here corresponds to chapter_api_data URL 

    // Offline Logic
    const { getDownloadedChapter, isChapterDownloaded } = useDownloads()
    const isDownloaded = isChapterDownloaded(id)
    const downloadedChapter = getDownloadedChapter(id)

    const { data: onlineData, isLoading, error } = useChapter(id)

    // Use local data if downloaded
    if (isDownloaded && downloadedChapter) {
        return (
            <View className="flex-1 bg-black">
                <Stack.Screen
                    options={{
                        title: downloadedChapter.chapterName ? `Chapter ${downloadedChapter.chapterName}` : 'Reader',
                        headerStyle: { backgroundColor: '#000' },
                        headerTintColor: '#fff'
                    }}
                />

                <FlatList
                    data={downloadedChapter.images}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <Image
                            source={{ uri: item }}
                            style={{ width: width, height: width * 1.5 }}
                            contentFit="contain"
                        />
                    )}
                />
            </View>
        )
    }

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-black">
                <Stack.Screen options={{ title: 'Loading Chapter...' }} />
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        )
    }

    if (error || !onlineData) {
        return (
            <View className="flex-1 justify-center items-center bg-black">
                <Stack.Screen options={{ title: 'Error' }} />
                <Text className="text-white">Error loading chapter.</Text>
            </View>
        )
    }

    const chapter = onlineData.data.item
    const domainCdn = onlineData.data.domain_cdn

    return (
        <View className="flex-1 bg-black">
            <Stack.Screen
                options={{
                    title: chapter.chapter_name ? `Chapter ${chapter.chapter_name}` : 'Reader',
                    headerStyle: { backgroundColor: '#000' },
                    headerTintColor: '#fff'
                }}
            />

            <FlatList
                data={chapter.chapter_image}
                contentContainerStyle={{ paddingBottom: 100 }}
                keyExtractor={(item) => item.image_file}
                renderItem={({ item }) => {
                    const imageUrl = onlineData.data.item.chapter_path
                        ? `${domainCdn}/${onlineData.data.item.chapter_path}/${item.image_file}`
                        : `${domainCdn}/${item.image_file}`

                    return (
                        <ReactNativeZoomableView
                            maxZoom={3}
                            minZoom={1}
                            zoomStep={0.5}
                            initialZoom={1}
                            bindToBorders={true}
                            style={{ width: width, height: width * 1.5 }}
                        >
                            <Image
                                source={{ uri: imageUrl }}
                                style={{ width: '100%', height: '100%' }}
                                contentFit="contain"
                                cachePolicy="memory-disk"
                            />
                        </ReactNativeZoomableView>
                    )
                }}
                ListFooterComponent={() => {
                    const { slug } = useLocalSearchParams<{ slug: string }>()
                    const { data: mangaData } = useMangaDetail(slug)

                    if (!mangaData || !mangaData.data.item.chapters) return null

                    const chapters = mangaData.data.item.chapters[0].server_data
                    const currentIndex = chapters.findIndex(c => c.chapter_api_data === id)

                    if (currentIndex === -1) return null

                    // API often returns chapters in descending order (latest first), so "Next" chapter is index - 1
                    // But we reversed it in the detail screen list... wait, let's check the raw data.
                    // Usually API returns [Chap 10, Chap 9, ... Chap 1]. 
                    // So "Next" (Chap 2) would be at index of (Chap 1) - 1.
                    const nextChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null
                    const prevChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null

                    return (
                        <View className="flex-row justify-between px-6 py-8 pb-20 bg-black">
                            <View className="flex-1 mr-2">
                                {prevChapter ? (
                                    <Link
                                        href={{
                                            pathname: '/chapter/[id]',
                                            params: { id: prevChapter.chapter_api_data, slug }
                                        }}
                                        replace
                                        asChild
                                    >
                                        <TouchableOpacity className="bg-zinc-800 py-3 rounded-xl flex-row justify-center items-center border border-zinc-700">
                                            <Ionicons name="chevron-back" size={20} color="white" />
                                            <Text className="text-white font-bold ml-1 text-sm bg-zinc-800">Chap trước</Text>
                                        </TouchableOpacity>
                                    </Link>
                                ) : (
                                    <View className="bg-zinc-900 py-3 rounded-xl flex-row justify-center items-center opacity-50">
                                        <Ionicons name="chevron-back" size={20} color="#666" />
                                        <Text className="text-zinc-500 font-bold ml-1 text-sm">Chap trước</Text>
                                    </View>
                                )}
                            </View>

                            <View className="flex-1 ml-2">
                                {nextChapter ? (
                                    <Link
                                        href={{
                                            pathname: '/chapter/[id]',
                                            params: { id: nextChapter.chapter_api_data, slug }
                                        }}
                                        replace
                                        asChild
                                    >
                                        <TouchableOpacity className="bg-red-600 py-3 rounded-xl flex-row justify-center items-center">
                                            <Text className="text-white font-bold mr-1 text-sm bg-red-600">Chap sau</Text>
                                            <Ionicons name="chevron-forward" size={20} color="white" />
                                        </TouchableOpacity>
                                    </Link>
                                ) : (
                                    <View className="bg-zinc-900 py-3 rounded-xl flex-row justify-center items-center opacity-50">
                                        <Text className="text-zinc-500 font-bold mr-1 text-sm">Hết</Text>
                                        <Ionicons name="chevron-forward" size={20} color="#666" />
                                    </View>
                                )}
                            </View>
                        </View>
                    )
                }}
            />
        </View>
    )
}
