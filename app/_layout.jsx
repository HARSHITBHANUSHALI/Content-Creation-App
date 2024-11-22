import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack, SplashScreen } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import "../global.css";
import { useColorScheme } from '@/hooks/useColorScheme';
import {Text} from 'react-native'
import GlobalProvider from '../context/GlobalProvider'
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const colorScheme = useColorScheme();
  // const [loaded] = useFonts({
  //   SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  // });
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if(error) throw error;
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if(!fontsLoaded && !error) return null;

  return (
    // <ThemeProvider value={colorScheme === 'white' ? DarkTheme : DefaultTheme}>
    //   <Stack>
    //     {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
    //     {/* <Stack.Screen name="coffee" options={{headerShown:false}}/> */}
    //     <Stack.Screen name="index" options={{title: "Home", headerShown: false}}/>
    //     {/* <Stack.Screen name="contact" options={{title: "Contact Us"}}/>  */}
    //     <Stack.Screen name="+not-found" />
    //   </Stack>
    // </ThemeProvider>
    <GlobalProvider>
      <Stack>
        <Stack.Screen name='(tabs)' options={{headerShown:false}}/>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="search/[query]" options={{ headerShown: false }} />
      </Stack>
    </GlobalProvider>
  );
}
