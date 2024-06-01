import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack } from "expo-router";
import { useColorScheme } from "@/components/useColorScheme";
import LoginView from "@/app/(auth)/LoginView"; 
import UserProfileView from './UserProfileView';
import FriendsView from './FriendsView';
// import other screens...
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
      <Stack.Screen name="UserProfileView" options={{ headerShown: false }} />
      <Stack.Screen name="FriendsView" options={{ headerShown: false }} />
      <Stack.Screen name="FriendsList" options={{ headerShown: false }} />
      <Stack.Screen name="AddFriends" options={{ headerShown: false }} />
      <Stack.Screen name="FriendRequests" options={{ headerShown: false }} />
      <Stack.Screen name="FriendProfile" options={{ headerShown: false }} />
      <Stack.Screen name="FavoriteSpotsView" options={{ headerShown: false }} />
      <Stack.Screen name="FoodPreferencesView" options={{ headerShown: false }} />
      <Stack.Screen name="BookmarkedSpotsView" options={{ headerShown: false }} />
      <Stack.Screen name="VisitedSpotsView" options={{ headerShown: false }} />
      <Stack.Screen name="EditAccountView" options={{ headerShown: false }} />
      <Stack.Screen name="LoginView" component={LoginView} options={{ headerShown: false }} />
    </Stack>
  );
}
