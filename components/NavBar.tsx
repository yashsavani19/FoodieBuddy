/**
 * NavBar.tsx
 * 
 * This file defines the NavBar component, which is a navigation bar used in the Buddy Chat and Friends Chat screens.
 * The NavBar component provides two buttons: one for navigating back to the previous screen and one for opening the
 * settings screen.
 * 
 * Props:
 * - openSettings: A function that is called when the settings button is pressed.
 * 
 * The component uses React Navigation's useNavigation hook to handle navigation actions.
 * The AntDesign and MaterialIcons components from @expo/vector-icons are used to render the icons for the buttons.
 */

import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

interface NavBarProps {
  openSettings: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ openSettings }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.navigationBar}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navButton}>
        <AntDesign name="arrowleft" size={24} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity onPress={openSettings} style={styles.navButton}>
        <MaterialIcons name="settings" size={22} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#f2f2f2",
    width: "100%",
    height: 40,
  },
  navButton: {
    padding: 5,
  },
});

export default NavBar;