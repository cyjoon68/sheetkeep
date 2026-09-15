import { IBMPlexSansKR_400Regular, IBMPlexSansKR_600SemiBold } from "@expo-google-fonts/ibm-plex-sans-kr";
import { NotoSerifKR_700Bold } from "@expo-google-fonts/noto-serif-kr";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { SheetKeepProvider } from "@/providers";
import "@/theme/unistyles";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    IBMPlexSansKR_400Regular,
    IBMPlexSansKR_600SemiBold,
    NotoSerifKR_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SheetKeepProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTintColor: "#1A1612",
          headerStyle: { backgroundColor: "#F3EBDD" },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: "#F3EBDD" },
        }}
      >
        <Stack.Screen name="index" options={{ title: "시험지" }} />
        <Stack.Screen name="session/[examId]" options={{ title: "시험" }} />
      </Stack>
    </SheetKeepProvider>
  );
};

export default RootLayout;
