import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  GestureResponderEvent,
} from "react-native";
import TitleHeader from "@/components/TitleHeader";
import { AntDesign } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";
import { RootStackParamList } from "@/constants/navigationTypes";

export default function UserProfileView() {
  // Navigation hook for navigating to other screens
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, signOut } = useAuth(); // Use auth hook here

  function navigateToFavouriteSpots(event: GestureResponderEvent): void {
    // Assuming 'navigation' is already defined using the useNavigation hook
    navigation.navigate("FavoriteSpotsView");
  }

  function navigateToBookmarkedSpots(event: GestureResponderEvent): void {
    // Assuming 'navigation' is already defined using the useNavigation hook
    navigation.navigate("BookmarkedSpotsView");
  }

  function navigateToVisitedSpots(event: GestureResponderEvent): void {
    // Assuming 'navigation' is already defined using the useNavigation hook
    navigation.navigate("VisitedSpotsView");
  }

  function editAccount(event: GestureResponderEvent): void {
    // Assuming 'navigation' is already defined using the useNavigation hook
    navigation.navigate("EditAccountView");
  }

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <TitleHeader title="Profile" />
      {/* ScrollView for scrollable content */}
      <ScrollView style={styles.scrollView}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          {/* User Icon */}
          <View style={styles.iconWrapper}>
            <Image
              source={require("@/assets/images/user-icon.png")}
              style={styles.profilePicture}
            />
          </View>
          {/* User Display Name */}
          <Text style={styles.username}>{user?.displayName || ""}</Text>
          {/* Account Actions (e.g., Logout) */}
          <View style={styles.accountActions}>
            {/* Edit Account Button */}
            <TouchableOpacity onPress={editAccount}>
              <Text style={styles.editButton}>Edit Account</Text>
            </TouchableOpacity>
            {/* Logout Button */}
            <TouchableOpacity onPress={signOut}>
              <Text style={styles.editButton}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Menu Items Section */}
        <View style={styles.menuItemsSection}>
          {/* Food Preferences Button */}
          <TouchableOpacity
            onPress={navigateToFavouriteSpots}
            style={styles.menuItem}
          >
            <Image
              source={require("@/assets/images/preferences-icon.png")}
              style={styles.savedIcons}
            />
            <Text style={styles.menuItemText}>Favorite Spots</Text>
            <AntDesign name="right" style={styles.rightArrow} />
          </TouchableOpacity>
          {/* Favorite Spots Button */}
          <TouchableOpacity
            onPress={navigateToFavouriteSpots}
            style={styles.menuItem}
          >
            <Image
              source={require("@/assets/images/fave-Selected.png")}
              style={styles.savedIcons}
            />
            <Text style={styles.menuItemText}>Favorite Spots</Text>
            <AntDesign name="right" style={styles.rightArrow} />
          </TouchableOpacity>
          {/* Bookmarked Spots Button */}
          <TouchableOpacity
            onPress={navigateToBookmarkedSpots}
            style={styles.menuItem}
          >
            <Image
              source={require("@/assets/images/bookmark-Selected.png")}
              style={styles.savedIcons}
            />
            <Text style={styles.menuItemText}>Bookmarked Spots</Text>
            <AntDesign name="right" style={styles.rightArrow} />
          </TouchableOpacity>
          {/* Visited Spots Button */}
          <TouchableOpacity
            onPress={navigateToVisitedSpots}
            style={styles.menuItem}
          >
            <Image
              source={require("@/assets/images/visited-Selected.png")}
              style={styles.savedIcons}
            />
            <Text style={styles.menuItemText}>Visited Spots</Text>
            <AntDesign name="right" style={styles.rightArrow} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rightArrow: {
    position: "absolute",
    right: 10,
    fontSize: 35,
    color: "#ededed",
  },

  savedIcons: {
    width: 35,
    height: 35,
    resizeMode: "contain",
    marginRight: 20,
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    marginTop: 100,
  },

  profileSection: {
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
  },
  iconWrapper: {
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
  },
  editButton: {
    fontSize: 20,
    margin: 10,
  },
  menuItemsSection: {
    marginTop: 5,
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
    borderRadius: 200,
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
