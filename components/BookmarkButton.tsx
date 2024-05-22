import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

interface BookmarksButtonProps {
  onPress: () => void;
}

const BookmarksButton: React.FC<BookmarksButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <Image
        source={require("@/assets/images/bookmark-Selected.png")}
        style={styles.savedIcons}
      />
      <Text style={styles.menuItemText}>Bookmarked Spots</Text>
      <AntDesign name="right" style={styles.rightArrow} />
    </TouchableOpacity>
  );
};

export default BookmarksButton;

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 30,
    marginVertical: 10,
    paddingVertical: 15,
    padding: 20,
    backgroundColor: "#363232",
    fontSize: 10,
    borderRadius: 20,
  },
  savedIcons: {
    width: 35,
    height: 35,
    resizeMode: "contain",
    marginRight: 20,
  },
  rightArrow: {
    position: "absolute",
    right: 20,
    fontSize: 35,
    color: "#ededed",
  },
  menuItemText: {
    marginLeft: 20,
    fontSize: 19,
    color: "#ededed",
  },
});
