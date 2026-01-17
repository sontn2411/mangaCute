
import MangaCard from '@/components/MangaCard'
import { useCategoryList, useCategoryManga, useSearchManga } from '@/hooks/useManga'
import { Ionicons } from '@expo/vector-icons'
import { Stack } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, FlatList, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function TabTwoScreen() {
  const [keyword, setKeyword] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Search Query
  const searchQuery = useSearchManga(searchTerm)

  // Category List Query
  const { data: categoryList, isLoading: isCategoriesLoading } = useCategoryList()

  // Category Data Query
  const categoryQuery = useCategoryManga(selectedCategory || '')

  // Determine which data to show
  const isSearching = !!searchTerm
  const isCategory = !!selectedCategory

  const activeQuery = isSearching ? searchQuery : (isCategory ? categoryQuery : null)
  const isLoading = activeQuery?.isLoading
  const isError = activeQuery?.isError
  const data = activeQuery?.data

  const handleSearch = () => {
    setSelectedCategory(null) // Clear category when searching
    setSearchTerm(keyword)
  }

  const handleCategorySelect = (slug: string) => {
    setKeyword('') // Clear search text
    setSearchTerm('') // Clear search query
    setSelectedCategory(slug === selectedCategory ? null : slug) // Toggle
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="px-4 py-3 pb-2">
        <Text className="text-3xl font-black mb-4 text-black dark:text-white tracking-tight">Khám phá</Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 dark:bg-zinc-800 rounded-2xl px-4 py-3 mb-4 shadow-sm">
          <Ionicons name="search" size={22} color="#888" />
          <TextInput
            className="flex-1 ml-3 text-base text-black dark:text-white font-medium"
            placeholder="Tìm kiếm truyện, tác giả..."
            placeholderTextColor="#888"
            value={keyword}
            onChangeText={setKeyword}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {keyword.length > 0 && (
            <TouchableOpacity onPress={() => {
              setKeyword('')
              setSearchTerm('')
            }}>
              <Ionicons name="close-circle" size={22} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        {/* Categories Horizontal List */}
        <View className="mb-2 h-10">
          {isCategoriesLoading ? (
            <ActivityIndicator size="small" color="#FF5555" />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
              {categoryList?.data.items.map((cat, index) => (
                <TouchableOpacity
                  key={cat._id + index}
                  onPress={() => handleCategorySelect(cat.slug)}
                  className={`mr-3 px-5 py-2 rounded-full border ${selectedCategory === cat.slug
                    ? 'bg-red-500 border-red-500'
                    : 'bg-transparent border-gray-300 dark:border-zinc-700'
                    }`}
                >
                  <Text className={`font-bold capitalize ${selectedCategory === cat.slug ? 'text-white' : 'text-gray-600 dark:text-gray-300'
                    }`}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>

      {/* Content Area */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF5555" />
        </View>
      ) : isError ? (
        <View className="flex-1 justify-center items-center px-8">
          <Ionicons name="alert-circle-outline" size={48} color="#FF5555" />
          <Text className="text-gray-500 mt-2 text-center">Không tải được nội dung.</Text>
        </View>
      ) : (activeQuery && data) ? (
        <FlatList
          data={data?.data.items}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, paddingTop: 10 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="mb-6 w-[48%]">
              <MangaCard manga={item} />
            </View>
          )}
          ListEmptyComponent={
            <View className="mt-20 items-center">
              <Text className="text-gray-500 font-medium">Không tìm thấy kết quả.</Text>
            </View>
          }
        />
      ) : (
        /* Initial State / Empty State */
        <ScrollView className="flex-1 px-4 mt-4" showsVerticalScrollIndicator={false}>
          <View className="items-center justify-center py-20 opacity-50">
            <Ionicons name="compass-outline" size={80} color="#ccc" />
            <Text className="text-gray-400 mt-4 text-center text-lg font-medium">Chọn thể loại hoặc tìm kiếm{"\n"}để bắt đầu hành trình của bạn</Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}
