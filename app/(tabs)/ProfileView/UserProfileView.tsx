import React, { useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import TitleHeader from "@/components/TitleHeader";
import { AntDesign, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import { handleLogout } from "@/controller/FirebaseHandler";
import { useAuth } from "@/context/AuthContext";
import { AppContext } from "@/context/AppContext";
import { fetchFavourites, addFavourite } from "@/controller/DatabaseHandler";

export default function UserProfileView() {
  const { user, signOut } = useAuth();
  // const { setFavourites } = useContext(AppContext);

  const menuItems = [
    { name: "Favorite Spots" },
    { name: "  Bookmarked Spots" },
    { name: "Visited Spots" },
  ];

  return (
    <View style={styles.container}>
      <TitleHeader title="Profile" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <View style={styles.profilePictureWrapper}>
            <Image
              source={require("@/assets/images/user-icon.png")} // Correct image path
              style={styles.profilePicture}
            />
          </View>
          <Text style={styles.username}>{user?.displayName || ""}</Text>
          <View style={styles.accountActions}>
            <TouchableOpacity
              // onPress={{}}
              style={styles.editButton}
            >
              <Text style={{ fontSize: 20 }}>Edit Account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={signOut}>
              <Text style={{ fontSize: 20 }}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menuItemsSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              {index === 0 && (
                <FontAwesome name="heart" size={35} color="red" />
              )}
              {index === 1 && (
                <FontAwesome name="bookmark" size={35} color="orange" />
              )}
              {index === 2 && (
                <MaterialIcons
                  name="add-location-alt"
                  size={35}
                  color="green"
                />
              )}

              <Text style={styles.menuItemText}>{item.name}</Text>

              {<AntDesign name="right" style={styles.rightArrow} />}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rightArrow: {
    position: "absolute",
    right: 20,
    fontSize: 35,
    color: "#ededed",
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    marginTop: 120,
  },

  profileSection: {
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
  },
  profilePictureWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  profilePicture: {
    width: 100,
    height: 100,
  },
  username: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
  },
  accountActions: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
  },
  editButton: {
    fontSize: 25,
    marginRight: 20,
  },
  menuItemsSection: {
    marginTop: 20,
  },
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
  editAccountText: {
    fontSize: 15, // Font size for Edit Account
    color: "#000", // Black text
  },
  menuItemText: {
    marginLeft: 20,
    fontSize: 19,
    color: "#ededed",
  },
});
