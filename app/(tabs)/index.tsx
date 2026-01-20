
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
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="default" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor="#FF9EB5" />
        }
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Kawaii Header */}
        <View className="px-5 pt-8 pb-4 flex-row justify-between items-center bg-background dark:bg-background-dark">
          <View>
            <Text className="text-xs font-bold text-primary dark:text-primary-dark uppercase tracking-widest mb-1">Welcome Back!</Text>
            <Text className="text-3xl font-black text-text dark:text-text-dark">
              Manga<Text className="text-primary dark:text-primary-dark">Cute 🌸</Text>
            </Text>
          </View>
          <TouchableOpacity className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark p-2.5 rounded-full shadow-sm shadow-pink-200 dark:shadow-none">
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
                    ? 'bg-primary dark:bg-primary-dark border-primary dark:border-primary-dark'
                    : 'bg-surface dark:bg-surface-dark border-border dark:border-border-dark'
                  }`}
                style={{ elevation: index === 0 ? 4 : 1, shadowColor: '#FF9EB5' }}
              >
                <Text className={`font-bold ${index === 0 ? 'text-white' : 'text-text-sub dark:text-gray-300'}`}>
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
            <Text className="text-xl font-black text-text dark:text-text-dark">Must Read!</Text>
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
          <SectionHeader title="Fresh Updates ✨" />
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
          <SectionHeader title="Popular Now 🔥" />
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
