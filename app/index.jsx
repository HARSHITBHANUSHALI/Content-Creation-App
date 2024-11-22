import { View, Text, Image, ScrollView } from 'react-native'
import React from 'react'
import { Link,Redirect,router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../constants'
import CustomButton from '../components/CustomButton'
import { useGlobalContext } from '../context/GlobalProvider'

const app = () => {
  const {isLoading,isLoggedIn} = useGlobalContext();

  if(!isLoading && isLoggedIn) return <Redirect href={"/home"}/>
  return (
    // <View className='w-full flex justify-center items-center h-full px-4'>
    //   <Text className='text-4xl font-pblack'>Aora!</Text>
    //   <StatusBar style='auto'/>
    //   <Link href="/home" style={{color:'blue'}} className='text-white'>Go to Home</Link>
    // </View>

      <SafeAreaView className='bg-primary h-full'>
        <ScrollView contentContainerStyle={{height:'100%'}}>
          <View className='w-full flex justify-center items-center min-h-[85vh] px-4'>
            <Image
              source={images.logo}
              className="w-[130px] h-[84px]"
              resizeMode="contain"
              />
            <Image
              source={images.cards}
              className='max-w-[380px] w-full h-[300px]'
              resizeMode='contain'
            />
            <View className="relative mt-5">
              <Text className="text-3xl text-white font-bold text-center">
                Discover Endless Possibilities with{' '}
                <Text className='text-secondary-200'>Aora</Text>
              </Text>
              <Image
                source={images.path}
                className='w-[136px] h-[15px] absolute -bottom-2 -right-8'
                resizeMode='contain'
              />
            </View>
            <Text className='text-sm font-pregular text-gray-100 mt-7 text-center'>
              Where creativity meets innovation: embark on a journey of limitless exploration wih Aora
            </Text>
            <CustomButton
              title="Continue with Email"
              handlePress={()=>router.push('/sign-in')}
              containerStyles="w-full mt-7"
            />
          </View>
        </ScrollView>
        <StatusBar backgroundColor='#161622' style='light'/>
      </SafeAreaView>

  )
}

export default app

