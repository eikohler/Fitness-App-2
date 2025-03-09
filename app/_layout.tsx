import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import * as SplashScreen from 'expo-splash-screen';
import { colors } from "@/styles/Styles";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {  

  const [loaded, error] = useFonts({
    "Inter": require('../assets/fonts/Inter-Variable.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const CustomTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors.mainBG,
      text: colors.primaryText,
    },
  };

  return (
    <ThemeProvider value={CustomTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
