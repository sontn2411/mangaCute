import { BlurView } from 'expo-blur'

import { Image, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const CustomHeader = () => {
  return (
    <SafeAreaView className='bg-white/70 backdrop-blur-md  flex items-center justify-center border-b-4 border-[#FFD1DC]/40'>
      <BlurView intensity={60} tint='light'>
        <View className='flex flex-row items-center gap-3 '>
          <Image
            className='w-10 h-10'
            source={require('@/assets/images/logo.png')}
          />
          <View className=' flex flex-col '>
            <Text className='text-xl font-chunky font-bold text-[#FF8FB1] leading-none'>
              MangaCute
            </Text>
            <Text className='text-[10px] text-[#7C5D66]/60 font-bold uppercase tracking-widest mt-0.5 text-center'>
              Your Daily Dose of Manga
            </Text>
          </View>
        </View>
      </BlurView>
    </SafeAreaView>
  )
}

export default CustomHeader
