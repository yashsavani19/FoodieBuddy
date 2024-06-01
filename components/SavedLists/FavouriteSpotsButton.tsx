import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

interface FavouriteSpotsButtonProps {
  onPress: () => any;
}

const FavouriteSpotsButton: React.FC<FavouriteSpotsButtonProps> = ({
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <Image
        source={require("@/assets/images/fave-Selected.png")}
        style={styles.savedIcons}
      />
      <Text style={styles.menuItemText}>Favorite Spots</Text>
      <AntDesign name="right" style={styles.rightArrow} />
    </TouchableOpacity>
  );
};

export default FavouriteSpotsButton;

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 30,
    marginVertical: 5,
    padding: 20,
    paddingVertical: 10,
    backgroundColor: "#363232",
    fontSize: 10,
    borderRadius: 30,
  },
  savedIcons: {
    width: 25,
    height: 25,
    resizeMode: "contain",
    marginRight: 20,
  },
  rightArrow: {
    position: "absolute",
    right: 20,
    fontSize: 25,
    color: "#ededed",
  },
  menuItemText: {
    marginLeft: 20,
    fontSize: 19,
    color: "#ededed",
    fontWeight: "500",
  },
});
