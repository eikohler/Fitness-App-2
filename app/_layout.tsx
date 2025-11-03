import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/styles/Styles";
import { SQLiteProvider } from "expo-sqlite";
import { initDB } from "@/utilities/dbFunctions";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {

  useFonts({
    "Inter": require('../assets/fonts/Inter-Variable.ttf'),
  });

  const CustomTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors.mainBG,
      text: colors.white,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SQLiteProvider databaseName="fitness.db" onInit={initDB}>
        <ThemeProvider value={CustomTheme}>
          <Stack screenOptions={{ animation: 'fade' }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="edit-workouts" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}
