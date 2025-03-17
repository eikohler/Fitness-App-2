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

  const modalStyle = {
    backgroundColor: colors.modalBG
  }

  return (
    <ThemeProvider value={CustomTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="edit-workouts" options={{ presentation: 'modal', headerShown: false, contentStyle: modalStyle }} />
        <Stack.Screen name="workout/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="workout/edit/[id]" options={{ presentation: 'modal', headerShown: false, contentStyle: modalStyle }} />
        <Stack.Screen name="exercise/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="exercise/edit/[id]" options={{ presentation: 'modal', headerShown: false, contentStyle: modalStyle }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
