import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/styles/Styles";

export default function RootLayout() {  

  useFonts({
    "Inter": require('../assets/fonts/Inter-Variable.ttf'),
  });

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
        <Stack.Screen name="workout/[id]" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
