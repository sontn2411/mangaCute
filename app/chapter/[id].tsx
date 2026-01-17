
import { useDownloads } from '@/hooks/useDownloads'
import { useChapter } from '@/hooks/useManga'
import { Image } from 'expo-image'
import { Stack, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { ActivityIndicator, Dimensions, FlatList, Text, View } from 'react-native'

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
                keyExtractor={(item) => item.image_file}
                renderItem={({ item }) => {
                    const imageUrl = onlineData.data.item.chapter_path
                        ? `${domainCdn}/${onlineData.data.item.chapter_path}/${item.image_file}`
                        : `${domainCdn}/${item.image_file}`

                    return (
                        <Image
                            source={{ uri: imageUrl }}
                            style={{ width: width, height: width * 1.5 }} // Aspect ratio estimate, usually fit width
                            contentFit="contain"
                            cachePolicy="memory-disk"
                        />
                    )
                }}
            />
        </View>
    )
}
