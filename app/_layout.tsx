import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { queryClient } from "@/lib/query-client";
import { AppProvider } from "@/context/AppContext";
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from "@expo-google-fonts/nunito";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="home" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="reminders" />
      <Stack.Screen name="reminders-add" />
      <Stack.Screen name="trainings" />
      <Stack.Screen name="training-add" />
      <Stack.Screen name="training/[id]" />
      <Stack.Screen name="diary" />
      <Stack.Screen name="knowledge" />
      <Stack.Screen name="knowledge/[id]" />
      <Stack.Screen name="suggestions" />
      <Stack.Screen name="nutrition" />
      <Stack.Screen name="reviews" />
      <Stack.Screen name="help" />
      <Stack.Screen name="admin-users" />
      <Stack.Screen name="admin-records" />
      <Stack.Screen name="admin-records/[userId]" />
      <Stack.Screen name="admin-diaries" />
      <Stack.Screen name="admin-diaries/[userId]" />
      <Stack.Screen name="admin-help-list" />
      <Stack.Screen name="admin-help/[userId]" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <RootLayoutNav />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </AppProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
