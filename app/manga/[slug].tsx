
import { useDownloads } from '@/hooks/useDownloads'
import { useFavorites } from '@/hooks/useFavorites'
import { useMangaDetail } from '@/hooks/useManga'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'

const CDN_URL = 'https://otruyenapi.com/uploads/comics/'


function shortenTitle(title: string, maxLength = 16) {
    const match = title.match(/\[Chap[^\]]+\]$/)
    const suffix = match ? match[0] : ''
    const main = suffix ? title.replace(suffix, '').trim() : title

    if (main.length <= maxLength) return title

    return `${main.slice(0, maxLength)}… ${suffix}`
}


export default function MangaDetailScreen() {
    const { slug } = useLocalSearchParams<{ slug: string }>()
    const { data, isLoading } = useMangaDetail(slug)
    const router = useRouter()
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

    // Favorites Logic
    const favorites = useFavorites((state) => state.favorites)
    const { addFavorite, removeFavorite } = useFavorites()
    const favorite = data?.data.item ? favorites.some(f => f._id === data.data.item._id) : false

    // Download Logic
    const { downloadChapter } = useDownloads()
    const downloads = useDownloads(state => state.downloads)


    const toggleFavorite = () => {
        if (!data?.data.item) return
        if (favorite) {
            removeFavorite(data.data.item._id)
        } else {
            addFavorite(data.data.item)
        }
    }

    if (isLoading || !data) {
        return (
            <View className="flex-1 justify-center items-center bg-white dark:bg-black">
                <Stack.Screen options={{ headerShown: false }} />
                <ActivityIndicator size="large" color="#FF5555" />
            </View>
        )
    }

    const manga = data.data.item
    const imageUrl = manga.thumb_url.startsWith('http')
        ? manga.thumb_url
        : `${CDN_URL}${manga.thumb_url}`

    const chapters = manga.chapters?.[0]?.server_data || []



    return (
        <View className="flex-1 bg-white dark:bg-black">
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="light-content" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Parallax-style Header */}
                <View className="relative h-[450px]">
                    <Image
                        source={{ uri: imageUrl }}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                        transition={500}
                    />
                    <LinearGradient
                        colors={['transparent', 'transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,1)']}
                        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 400 }}
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.6)', 'transparent']}
                        style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 100 }}
                    />

                    {/* Navigation Bar */}
                    <Animated.View entering={FadeInUp.delay(200)} className="absolute top-12 left-0 right-0 flex-row justify-between items-center px-4 z-10">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 bg-white/20 rounded-full justify-center items-center backdrop-blur-md border border-white/10"
                        >
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={toggleFavorite}
                            className="w-10 h-10 bg-white/20 rounded-full justify-center items-center backdrop-blur-md border border-white/10"
                        >
                            <Ionicons
                                name={favorite ? "heart" : "heart-outline"}
                                size={24}
                                color={favorite ? "#FF5555" : "white"}
                            />
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Title & Main Info */}
                    <Animated.View entering={FadeInUp.delay(300)} className="absolute bottom-0 left-0 right-0 p-6">
                        <View className="flex-row items-center mb-3 flex-wrap">
                            <View className="bg-red-500 px-3 py-1 rounded-lg mr-2 mb-1 shadow-lg shadow-red-500/30">
                                <Text className="text-white text-xs font-black uppercase tracking-wider">{manga.status}</Text>
                            </View>
                            {manga.author?.map((auth, idx) => (
                                <View key={idx} className="bg-white/20 px-3 py-1 rounded-lg mr-2 mb-1 backdrop-blur-sm border border-white/10">
                                    <Text className="text-white text-xs font-bold">{auth}</Text>
                                </View>
                            ))}
                        </View>
                        <Text className="text-4xl font-black text-white mb-2 shadow-sm leading-10 shadow-black">{manga.name}</Text>
                        <Text className="text-gray-300 font-medium text-sm">Cập nhật: {new Date(manga.updatedAt).toLocaleDateString()}</Text>
                    </Animated.View>
                </View>

                {/* Content Body */}
                <View className="px-5 py-6 bg-white dark:bg-black rounded-t-[32px] -mt-8 relative z-0">

                    {/* Description */}
                    <Animated.View entering={FadeInDown.delay(400)}>
                        <Text className="text-lg font-bold text-black dark:text-white mb-2">Nội dung</Text>
                        <Text
                            className="text-gray-600 dark:text-gray-300 leading-6 text-base"
                            numberOfLines={isDescriptionExpanded ? undefined : 3}
                        >
                            {manga.content?.replace(/<[^>]+>/g, '').trim()}
                        </Text>
                        <TouchableOpacity onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)} className="mt-2">
                            <Text className="text-red-500 font-bold">{isDescriptionExpanded ? 'Thu gọn' : 'Xem thêm'}</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Stats Divider */}
                    <View className="h-[1px] bg-gray-100 dark:bg-zinc-800 my-6" />

                    {/* Chapters Header */}
                    <View className="flex-row justify-between items-end mb-4">
                        <Text className="text-2xl font-black text-black dark:text-white">Chương</Text>
                        <Text className="text-red-500 font-bold bg-red-50 dark:bg-red-900/10 px-3 py-1 rounded-full text-xs">
                            {chapters.length} Chương
                        </Text>
                    </View>

                    {/* List */}
                    <View>
                        {[...chapters].reverse().map((chapter, index) => {
                            const downloadState = downloads[chapter.chapter_api_data]
                            const isDownloaded = downloadState?.status === 'completed'
                            const isDownloading = downloadState?.status === 'downloading'

                            return (
                                <Animated.View
                                    key={chapter.chapter_api_data}
                                    entering={FadeInDown.delay(500 + (index * 50)).springify()}
                                    className="mb-3"
                                >
                                    <View className="flex-row items-center bg-gray-50 dark:bg-zinc-900 p-3 rounded-2xl border border-gray-100 dark:border-zinc-800">
                                        <Link
                                            href={{
                                                pathname: '/chapter/[id]',
                                                params: { id: chapter.chapter_api_data }
                                            }}
                                            asChild
                                        >
                                            <TouchableOpacity className="flex-1 flex-row items-center">
                                                <View className="w-10 h-10 bg-gray-200 dark:bg-zinc-800 rounded-full items-center justify-center mr-3">
                                                    <Text className="font-bold text-gray-500 text-xs">#{chapters.length - index}</Text>
                                                </View>
                                                <View>
                                                    <Text className="text-base font-bold text-gray-900 dark:text-white">
                                                        {shortenTitle(chapter.filename)}
                                                    </Text>
                                                    {/* <Text className="text-xs text-gray-400 mt-0.5" numberOfLines={1}>
                                                        {shortenTitle(chapter.filename)}
                                                    </Text> */}
                                                </View>
                                            </TouchableOpacity>
                                        </Link>

                                        <TouchableOpacity
                                            onPress={() => downloadChapter(manga, chapter)}
                                            className="ml-3 w-10 h-10 items-center justify-center bg-white dark:bg-black rounded-full shadow-sm"
                                            disabled={isDownloaded || isDownloading}
                                        >
                                            {isDownloading ? (
                                                <View className="items-center justify-center">
                                                    <ActivityIndicator size="small" color="#FF5555" />
                                                    <Text className="text-[8px] text-red-500 font-bold absolute -bottom-3">{downloadState.progress}%</Text>
                                                </View>
                                            ) : (
                                                <Ionicons
                                                    name={isDownloaded ? "checkmark" : "cloud-download-outline"}
                                                    size={20}
                                                    color={isDownloaded ? "#4CAF50" : "#999"}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </Animated.View>
                            )
                        })}
                    </View>
                </View>
            </ScrollView >

            {/* Floating Read Button */}
            {
                chapters.length > 0 && (
                    <Animated.View entering={FadeInUp.delay(600)} className="absolute bottom-8 align-middle w-full px-12">
                        <Link
                            href={{
                                pathname: '/chapter/[id]',
                                params: { id: chapters[0].chapter_api_data }
                            }}
                            asChild
                        >
                            <TouchableOpacity className="bg-red-500 py-4 rounded-full shadow-xl shadow-red-500/40 flex-row justify-center items-center">
                                <Ionicons name="book" size={20} color="white" style={{ marginRight: 8 }} />
                                <Text className="text-white font-black text-lg tracking-wide uppercase">Đọc ngay</Text>
                            </TouchableOpacity>
                        </Link>
                    </Animated.View>
                )
            }

        </View >
    )
}
