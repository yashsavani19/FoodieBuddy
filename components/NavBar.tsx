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
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

interface NavBarProps {
  openSettings: () => void;
  title?: string;
}

const NavBar: React.FC<NavBarProps> = ({ openSettings, title }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.navigationBar}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navButton}>
        <AntDesign name="arrowleft" size={wp('6%')} color="#000" />
      </TouchableOpacity>
      <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
      <TouchableOpacity onPress={openSettings} style={styles.navButton}>
        <MaterialIcons name="settings" size={wp('6%')} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
    backgroundColor: "#f2f2f2",
    width: wp('100%'),
    height: hp('6%'),
  },
  titleText: {
    fontSize: wp('5%'),
    fontWeight: "bold",
    color: "#000",
    maxWidth: wp('60%'),
  },
  navButton: {
    padding: wp('1%'),
  },
});

export default NavBar;
