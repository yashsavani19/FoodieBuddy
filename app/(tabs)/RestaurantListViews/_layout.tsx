import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import index from "./index";
import DetailsView from "./DetailsView";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

const Stack = createStackNavigator();


export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
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
    <Stack.Navigator initialRouteName="index">
      <Stack.Screen
        name="index"
        component={index}
        options={{ title: "Restaurant List", headerShown: false }}
      />
      <Stack.Screen
        name="DetailsView"
        component={DetailsView}
        options={{ title: "Restaurant Details", headerShown: false }}
      />
    </Stack.Navigator>
  );
};
