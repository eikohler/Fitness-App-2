import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/styles/Styles";
import { SQLiteProvider } from "expo-sqlite";
import { initDB } from "@/utilities/db-functions";
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
      text: colors.primaryText,
    },
  };

  const modalStyle = {
    backgroundColor: "transparent"
  }
  const modalStyle2 = {
    backgroundColor: colors.modalBG
  }

  return (
    <GestureHandlerRootView>
      <ThemeProvider value={CustomTheme}>
        <SQLiteProvider databaseName="fitness.db" onInit={initDB}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            {/* <Stack.Screen name="edit-workouts" options={{
              presentation: 'modal',
              headerShown: false,
              contentStyle: modalStyle,
              gestureEnabled: false
            }} /> */}
            <Stack.Screen name="edit-workouts" options={{ headerShown: false }} />
            <Stack.Screen name="workout/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="workout/edit/[id]" options={{ presentation: 'modal', headerShown: false, contentStyle: modalStyle2 }} />
            <Stack.Screen name="exercise/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="exercise/edit/[id]" options={{ presentation: 'modal', headerShown: false, contentStyle: modalStyle2 }} />
          </Stack>
        </SQLiteProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
