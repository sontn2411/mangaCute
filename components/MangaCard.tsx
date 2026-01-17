
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
                    <View className="relative w-[300px] h-[180px] rounded-3xl overflow-hidden shadow-lg shadow-black/40">
                        <Image
                            source={{ uri: imageUrl }}
                            style={{ width: '100%', height: '100%' }}
                            contentFit="cover"
                            transition={500}
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.95)']}
                            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 120 }}
                        />
                        <View className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-md px-3 py-1 rounded-full">
                            <Text className="text-white text-xs font-black uppercase tracking-wider">Hot</Text>
                        </View>
                        <View className="absolute bottom-4 left-4 right-4">
                            <Text className="text-white font-black text-xl leading-6 mb-1 shadow-sm" numberOfLines={2}>
                                {manga.name}
                            </Text>
                            <Text className="text-gray-300 text-xs font-medium" numberOfLines={1}>
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
                <View className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-md bg-gray-200 dark:bg-zinc-800 elevation-5">
                    <Image
                        source={{ uri: imageUrl }}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                        transition={500}
                        cachePolicy="memory-disk"
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.7)']}
                        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 80 }}
                    />
                    {/* Badge */}
                    {(index < 2) && (
                        <View className="absolute top-0 left-0 bg-yellow-400 px-2 py-1 rounded-br-xl shadow-sm">
                            <Text className="text-black text-[10px] font-bold uppercase tracking-wide">
                                Top {index + 1}
                            </Text>
                        </View>
                    )}
                    <View className="absolute bottom-2 right-2">
                        <View className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg">
                            <Text className="text-white text-[10px] font-bold">
                                {manga.current_chapter?.[0]?.name || 'Update'}
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="mt-3 ml-1">
                    <Text
                        className="text-sm font-bold text-gray-900 dark:text-white leading-5"
                        numberOfLines={2}
                    >
                        {manga.name}
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium" numberOfLines={1}>
                        {new Date(manga.updatedAt).toLocaleDateString()}
                    </Text>
                </View>
            </TouchableOpacity>
        </Link>
    )
}
