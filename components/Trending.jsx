import { View, Text, FlatList, TouchableOpacity,ImageBackground, Image } from 'react-native'
import React,{useState} from 'react'
import * as Animatable from 'react-native-animatable'
import { icons } from '../constants'
import { Video, ResizeMode } from 'expo-av'

const zoomIn = {
0:{
  scale: 0.9
},
1:{
  scale: 1
}
}
const zoomOut = {
0:{
  scale: 1
},
1:{
  scale: 0.9
}
}
const TrendingItem = ({activeItem,item}) =>{

  const [play, setPlay] = useState(false)
  console.log("itemvideo",item,activeItem);
  return(
    <Animatable.View
      className="mr-5"
      animation={activeItem===item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play?(
        <Video
        source={{ uri: item.video }} // Video URL from item
        className="w-full h-full rounded-[35px] mt-3 bg-white/10 absolute z-10"
        resizeMode={ResizeMode.CONTAIN} // Updated resize mode usage
        useNativeControls
        shouldPlay={true} // Auto-play video when it's ready
        onError={(error) => console.error("Video Error: ", error)}
        onPlaybackStatusUpdate={(status) => {
          if (status.didJustFinish) {
            setPlay(false); // Stop playing when video finishes
          }
        }}
      />
      ):(
        <TouchableOpacity className="relative justify-center items-center"
          onPress={()=>setPlay(true)}
        >
          <ImageBackground
            source={{uri:item.thumbnail}}
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode='cover'
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  )
}

const Trending = ({posts}) => {
  const [activeItem, setActiveItem] = useState(posts[1])

  const viewableItemsChanged = ({viewableItems}) =>{
    if(viewableItems.length >0)
      setActiveItem(viewableItems[0].key)
  }
  return (
    <FlatList
      data={posts}
      keyExtractor={(item)=>item.$id}
      renderItem={({item})=>(
        <TrendingItem activeItem={activeItem} item={item}/>
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 7
      }}
      contentOffset={{x:170}}
      horizontal
    />
  )
}

export default Trending