
import MangaCard from '@/components/MangaCard'
import SectionHeader from '@/components/SectionHeader'
import { HomeSkeleton } from '@/components/ui/Skeleton'
import { useCategoryList, useHomeManga } from '@/hooks/useManga'
import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import React from 'react'
import { FlatList, RefreshControl, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'

export default function HomeScreen() {
  const { data: homeData, isLoading, error, refetch } = useHomeManga()
  const { data: categories } = useCategoryList()
  const router = useRouter()

  const onRefresh = React.useCallback(() => {
    refetch()
  }, [refetch])

  if (isLoading) {
    return <HomeSkeleton />
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-[#FFF0F5]">
        <Text className="text-pink-500 font-bold mb-2">Rất tiếc! Đã có lỗi xảy ra.</Text>
        <TouchableOpacity onPress={() => refetch()} className="bg-pink-400 px-4 py-2 rounded-full">
          <Text className="text-white font-bold">Thử lại</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // Filter items for sections
  const featuredItems = homeData?.data.items.slice(0, 5) || []
  const newArrivals = homeData?.data.items.slice(5, 15) || []
  const popularFeed = homeData?.data.items.slice(15) || []

  return (
    <SafeAreaView className="flex-1 bg-[#FFF0F5] dark:bg-black">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFF0F5" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor="#FF9EB5" />
        }
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Kawaii Header */}
        <View className="px-5 pt-8 pb-4 flex-row justify-between items-center bg-[#FFF0F5]">
          <View>
            <Text className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-1">Chào mừng trở lại!</Text>
            <Text className="text-3xl font-black text-gray-800 dark:text-white">
              Manga<Text className="text-pink-500">Cute 🌸</Text>
            </Text>
          </View>
          <TouchableOpacity className="bg-white border border-pink-100 p-2.5 rounded-full shadow-sm shadow-pink-200">
            <Ionicons name="notifications" size={22} color="#FF9EB5" />
          </TouchableOpacity>
        </View>

        {/* Categories Pill List - Kawaii Style */}
        <View className="mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
            {categories?.data.items.slice(0, 8).map((cat, index) => (
              <TouchableOpacity
                key={cat._id}
                onPress={() => router.push({ pathname: '/(tabs)/explore', params: { category: cat.slug } })}
                className={`mr-3 px-5 py-2.5 rounded-full border ${index === 0
                  ? 'bg-pink-400 border-pink-400'
                  : 'bg-white border-pink-100'
                  }`}
                style={{ elevation: index === 0 ? 4 : 1, shadowColor: '#FF9EB5' }}
              >
                <Text className={`font-bold ${index === 0 ? 'text-white' : 'text-gray-500'}`}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Carousel */}
        <View className="mb-8">
          <View className="px-5 mb-4 flex-row items-center">
            <View className="bg-yellow-400 p-1 rounded-full mr-2">
              <Ionicons name="star" size={14} color="white" />
            </View>
            <Text className="text-xl font-black text-gray-800">Đáng đọc!</Text>
          </View>
          <FlatList
            horizontal
            data={featuredItems}
            keyExtractor={item => item._id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            renderItem={({ item }) => (
              <MangaCard manga={item} isFeatured />
            )}
          />
        </View>

        {/* New Arrivals */}
        <View className="mb-6">
          <SectionHeader title="Truyện mới cập nhật ✨" />
          <FlatList
            horizontal
            data={newArrivals}
            keyExtractor={item => item._id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            renderItem={({ item, index }) => (
              <View className="mr-5 w-[150px]">
                <MangaCard manga={item} index={index} />
              </View>
            )}
          />
        </View>

        {/* Popular / Grid */}
        <View className="px-5">
          <SectionHeader title="Đang hot 🔥" />
          <View className="flex-row flex-wrap justify-between">
            {popularFeed.map((manga, index) => (
              <View key={manga._id} className="mb-2">
                <MangaCard manga={manga} index={index + 15} />
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}
