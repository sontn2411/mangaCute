
import MangaCard from '@/components/MangaCard'
import SectionHeader from '@/components/SectionHeader'
import { useCategoryList, useHomeManga } from '@/hooks/useManga'
import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import React from 'react'
import { ActivityIndicator, FlatList, RefreshControl, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'

export default function HomeScreen() {
  const { data: homeData, isLoading, error, refetch } = useHomeManga()
  const { data: categories } = useCategoryList()
  const router = useRouter()

  const onRefresh = React.useCallback(() => {
    refetch()
  }, [])

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color="#FF5555" />
      </View>
    )
  }

  // Filter items for sections
  const featuredItems = homeData?.data.items.slice(0, 5) || []
  const newArrivals = homeData?.data.items.slice(5, 15) || []
  const popularFeed = homeData?.data.items.slice(15) || []

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor="#FF5555" />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header Section */}
        <View className="px-5 pt-4 pb-2 flex-row justify-between items-center">
          <View>
            <Text className="text-sm font-bold text-gray-400 uppercase tracking-widest">Good Morning</Text>
            <Text className="text-2xl font-black text-black dark:text-white">Otaku World</Text>
          </View>
          <TouchableOpacity className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-full">
            <Ionicons name="notifications-outline" size={24} color="#FF5555" />
          </TouchableOpacity>
        </View>

        {/* Featured Carousel */}
        <View className="mt-4">
          <View className="px-5 mb-3 flex-row items-center">
            <Ionicons name="flame" size={20} color="#FF5555" style={{ marginRight: 6 }} />
            <Text className="text-lg font-bold text-black dark:text-white">Trending Now</Text>
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

        {/* Categories Pill List */}
        <View className="mt-8">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
            {categories?.data.items.slice(0, 8).map((cat, index) => (
              <TouchableOpacity
                key={cat._id}
                onPress={() => router.push({ pathname: '/(tabs)/explore', params: { category: cat.slug } })}
                className={`mr-3 px-6 py-3 rounded-2xl ${index === 0 ? 'bg-black dark:bg-white' : 'bg-gray-100 dark:bg-zinc-800'}`}
              >
                <Text className={`font-bold ${index === 0 ? 'text-white dark:text-black' : 'text-gray-600 dark:text-gray-300'}`}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* New Arrivals */}
        <View className="mt-8">
          <SectionHeader title="New Arrivals" />
          <FlatList
            horizontal
            data={newArrivals}
            keyExtractor={item => item._id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            renderItem={({ item, index }) => (
              <View className="mr-4 w-[140px]">
                <MangaCard manga={item} index={index} />
              </View>
            )}
          />
        </View>

        {/* Popular / Grid */}
        <View className="mt-4 px-5">
          <SectionHeader title="Popular Feed" />
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
