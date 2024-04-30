import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'UserProfileView',
};

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack>
      <Stack.Screen name="UserProfileView" options={{ headerShown: false }} />
      <Stack.Screen name="SaveListView" options={{ headerShown: false }} />
      <Stack.Screen name="FavoriteSpotsView"  options={{ headerShown: false }} />  
      <Stack.Screen name="BookmarkedSpotsView"  options={{ headerShown: false }} />  
      <Stack.Screen name="VisitedSpotsView"  options={{ headerShown: false }} />  
    </Stack>
    
  );
}
