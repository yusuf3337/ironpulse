import "../global.css";
import React, { Suspense } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SQLiteProvider } from "expo-sqlite";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import { migrateDbIfNeeded } from "@/db/migrations";
import { LanguageProvider } from "@/context/LanguageContext";
import { AlertModalProvider } from "@/context/AlertModalContext";

// Disable Reanimated v4 strict mode render warnings for NativeWind / Screens
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

function LoadingFallback(): React.JSX.Element {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" color="#CCFF00" />
    </View>
  );
}

export default function RootLayout(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AlertModalProvider>
          <StatusBar style="light" />
          <Suspense fallback={<LoadingFallback />}>
            <SQLiteProvider databaseName="ironpulse.db" onInit={migrateDbIfNeeded} useSuspense>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: "#0D0D10" },
                  animation: "slide_from_right",
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="boxing/timer"
                  options={{ headerShown: false, presentation: "fullScreenModal" }}
                />
                <Stack.Screen
                  name="workouts/active"
                  options={{ headerShown: false, presentation: "fullScreenModal" }}
                />
              </Stack>
            </SQLiteProvider>
          </Suspense>
        </AlertModalProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
