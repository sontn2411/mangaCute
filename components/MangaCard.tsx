
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Link } from 'expo-router'
import React from 'react'
import { Dimensions, Text, TouchableOpacity, View } from 'react-native'

const CDN_URL = 'https://otruyenapi.com/uploads/comics/'
const { width } = Dimensions.get('window')
const CARD_WIDTH = width * 0.42 // Dynamic width

interface MangaCardProps {
    manga: any
    index?: number
    isFeatured?: boolean
}

export default function MangaCard({ manga, index = 0, isFeatured = false }: MangaCardProps) {
    const imageUrl = manga.thumb_url.startsWith('http')
        ? manga.thumb_url
        : `${CDN_URL}${manga.thumb_url}`

    if (isFeatured) {
        return (
            <Link href={`/manga/${manga.slug}`} asChild>
                <TouchableOpacity className="mr-5 active:opacity-90">
                    <View className="relative w-[300px] h-[180px] rounded-[32px] overflow-hidden shadow-xl shadow-pink-300/40 border-4 border-white">
                        <Image
                            source={{ uri: imageUrl }}
                            style={{ width: '100%', height: '100%' }}
                            contentFit="cover"
                            transition={500}
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
                            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 120 }}
                        />
                        <View className="absolute top-4 right-4 bg-pink-400 px-3 py-1.5 rounded-full border-2 border-white shadow-sm">
                            <Text className="text-white text-xs font-black uppercase tracking-wider">🌸 Hot</Text>
                        </View>
                        <View className="absolute bottom-5 left-5 right-5">
                            <Text className="text-white font-black text-xl leading-6 mb-1 shadow-sm" numberOfLines={2}>
                                {manga.name}
                            </Text>
                            <Text className="text-pink-100 text-xs font-bold" numberOfLines={1}>
                                {manga.current_chapter?.[0]?.name || 'Latest'} • {manga.author?.[0] || 'Unknown'}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Link>
        )
    }

    return (
        <Link href={`/manga/${manga.slug}`} asChild>
            <TouchableOpacity className="mb-6 active:opacity-80" style={{ width: CARD_WIDTH }}>
                <View className="relative aspect-[2/3] rounded-[24px] overflow-hidden shadow-lg shadow-pink-200/50 bg-white border-2 border-pink-100 elevation-5">
                    <Image
                        source={{ uri: imageUrl }}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                        transition={500}
                        cachePolicy="memory-disk"
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(255, 158, 181, 0.4)']}
                        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 80 }}
                    />
                    {/* Badge */}
                    {(index < 2) && (
                        <View className="absolute top-0 left-0 bg-[#FFD54F] px-2.5 py-1.5 rounded-br-2xl border-b-2 border-r-2 border-white shadow-sm z-10">
                            <Text className="text-white text-[10px] font-black uppercase tracking-wide">
                                ✨ Top {index + 1}
                            </Text>
                        </View>
                    )}
                    <View className="absolute bottom-2 right-2">
                        <View className="bg-white/80 backdrop-blur-md px-2 py-1 rounded-xl border border-pink-100">
                            <Text className="text-pink-500 text-[10px] font-bold">
                                {manga.current_chapter?.[0]?.name || 'Update'}
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="mt-3 ml-1">
                    <Text
                        className="text-sm font-bold text-gray-700 dark:text-gray-200 leading-5"
                        numberOfLines={2}
                    >
                        {manga.name}
                    </Text>
                    <View className="flex-row items-center mt-1">
                        <View className="w-2 h-2 rounded-full bg-green-400 mr-1.5" />
                        <Text className="text-xs text-gray-400 font-medium" numberOfLines={1}>
                            {new Date(manga.updatedAt).toLocaleDateString()}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    )
}
