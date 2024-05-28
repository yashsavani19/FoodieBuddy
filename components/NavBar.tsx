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
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={openSettings} style={styles.navButton}>
        <MaterialIcons name="settings" size={22} color="white" />
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
    backgroundColor: "#000",
    width: "100%",
    height: 40,
  },
  navButton: {
    padding: 5,
  },
});

export default NavBar;
