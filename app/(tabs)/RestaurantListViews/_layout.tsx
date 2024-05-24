
import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

// Settings for the stack navigator
export const unstable_settings = {
  initialRouteName: 'ListView',
};

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

// Icon component for the tab bar
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

// Main component for the tab layout
export default function TabLayout() {
  // Get the color scheme using the useColorScheme hook
  const colorScheme = useColorScheme();

  return (
    // Stack navigator to handle navigation between screens
    <Stack>
      <Stack.Screen name="ListView" options={{ headerShown: false }} />
      <Stack.Screen name="DetailsView" options={{ headerShown: false }} />
    </Stack>
    
  );
}