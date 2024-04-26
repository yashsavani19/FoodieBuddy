import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Stack, Tabs, Route } from "expo-router";
import { Pressable } from "react-native";
import { Image } from "react-native";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import images from "@/assets/data/images";

import { createStackNavigator } from "@react-navigation/stack";

import index from "./RestaurantListViews/index";


function TabBarIcon(props: {
  name?: React.ComponentProps<typeof FontAwesome>["name"];
  imageSelected?: string;
  image?: string;
  color?: string;
}) {
  if (props.image) {
    const isSelected = props.image.includes("Selected");
    return (
      <Image
        source={{ uri: props.image }}
        style={{
          width: "100%",
          aspectRatio: isSelected ? "2.6" : "3.6",
          resizeMode: "contain",
          top: 6.5,
        }}
      />
    );
  } else {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
  }
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].headerBackground,
        },
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="RestaurantListViews"
        options={{
          title: "Home",
          tabBarLabel: "",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              image={focused ? images.homeSelectedIcon : images.homeIcon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Map"
        options={{
          title: "Map",
          tabBarLabel: "",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              image={focused ? images.mapSelectedIcon : images.mapIcon}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="ChatView"
        options={{
          title: "Chat",
          tabBarLabel: "",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              image={focused ? images.chatSelectedIcon : images.chatIcon}
            />
          ),

          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="ProfileView"
        options={{
          title: "Profile", // This will be the title if needed
          tabBarLabel: "",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              image={focused ? images.profileSelectedIcon : images.profileIcon}
            />
          ),
          headerShown: false, // This removes the default header
        }}
      />

      
    </Tabs>
  );
}
