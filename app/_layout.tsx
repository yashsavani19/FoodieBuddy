import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useColorScheme } from "@/components/useColorScheme";
import { ContextProvider } from "@/context/AppContext";
import Loading from "./Loading";
import { DataFetcher } from "@/components/DataFetcher";

import { AuthProvider, useAuth } from "@/context/AuthContext";

// Re-export ErrorBoundary from expo-router for error handling in the layout component
export { ErrorBoundary } from "expo-router";

// Configuration for initial route in the navigation system
export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from hiding automatically before assets are fully loaded
SplashScreen.preventAutoHideAsync();

// Root component that wraps the entire application
export default function RootLayout() {
  // Load custom fonts and icon sets
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Throw an error if font loading fails
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Hide splash screen when assets are loaded
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // State to ensure a minimum loading time
  const [minimumLoadingTimePassed, setMinimumLoadingTimePassed] =
    useState(false);

  // Set a timeout to manage minimum loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumLoadingTimePassed(true);
    }, 1000); // 1 second minimum loading time

    return () => clearTimeout(timer);
  }, []);

  // Render loading screen until all conditions are met
  if (!loaded || !minimumLoadingTimePassed) {
    return <Loading />;
  }

  // Provide authentication and context providers to the app
  return (
    <AuthProvider>
      <ContextProvider>
        <RootLayoutNav />
      </ContextProvider>
    </AuthProvider>
  );
}

// Navigation component that determines the layout based on authentication and theme
function RootLayoutNav() {
  const colorScheme = useColorScheme(); // Detect system color scheme
  const { authInitialised, user } = useAuth(); // Use authentication context

  // Display loading screen until authentication is initialised
  if (!authInitialised) return <Loading />;

  // Do not render anything if no user is authenticated
  if (!user && !authInitialised) return null;

  // Provide a theme based on the color scheme and setup the navigation stack
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
