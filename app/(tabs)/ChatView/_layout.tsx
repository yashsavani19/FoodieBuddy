import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack } from "expo-router";
import { useColorScheme } from "@/components/useColorScheme";

export const unstable_settings = {
  initialRouteName: "Chats",
};

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Chats" />
      {/* <Stack.Screen name="ChatScreen" options={{ headerShown: true}}/> */}
    </Stack>
  );
}
