import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack } from "expo-router";
import { useColorScheme } from "@/components/useColorScheme";

export const unstable_settings = {
  // Configuration settings for navigation
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "UserProfileView",
};

// Function to render tab bar icon
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

// TabLayout component for managing navigation stack
export default function TabLayout() {
  const colorScheme = useColorScheme(); // Get current color scheme

  return (
    // Stack navigator to manage navigation screens
    <Stack>
      {/* Define navigation screens */}
      {/* Each screen has header hidden */}
      <Stack.Screen
        name="UserProfileView"
        options={{ headerShown: false }}
      />{" "}
      {/* UserProfileView screen */}
      <Stack.Screen name="SaveListView" options={{ headerShown: false }} />{" "}
      {/* SaveListView screen */}
      <Stack.Screen
        name="FavoriteSpotsView"
        options={{ headerShown: false }}
      />{" "}
      {/* FavoriteSpotsView screen */}
      <Stack.Screen
        name="BookmarkedSpotsView"
        options={{ headerShown: false }}
      />{" "}
      {/* BookmarkedSpotsView screen */}
      <Stack.Screen
        name="VisitedSpotsView"
        options={{ headerShown: false }}
      />{" "}
      {/* VisitedSpotsView screen */}
    </Stack>
  );
}
