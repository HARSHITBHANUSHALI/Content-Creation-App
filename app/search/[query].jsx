import { View, Text, SafeAreaView, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import useAppwrite from '../../lib/useAppwrite'
import { searchPosts } from '../../lib/appwrite'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import VideoCard from '../../components/VideoCard'

const Search = () => {
  const {query} = useLocalSearchParams();
  const {data: posts, refetch} = useAppwrite(()=>searchPosts(query));

  useEffect(()=>{
    refetch();
  },[query])

  console.log(posts);

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
        data={posts}
        keyExtractor={(item)=> item.$id}
        renderItem={({item})=>(
          <VideoCard video={item}/>
        )}

        ListHeaderComponent={()=>(
          <View className='my-6 px-4 space-y-6'>
              <Text className='font-pmedium text-sm text-gray-100'>
                Search results
              </Text>
              <Text className='text-2xl font-pmedium text-white'>{query}</Text>
              <View className="mt-6 mb-8">
                <SearchInput initialQuery={query}/>
              </View>
          </View>
        )}
        ListEmptyComponent={()=>(
          <EmptyState
            title="No videos Found"
            subtitle="No videos found for this query"
          />
        )}
        
      />
    </SafeAreaView>
  )
}
export default Search