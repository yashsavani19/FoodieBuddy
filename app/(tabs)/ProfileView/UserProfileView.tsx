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
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";
import { RootStackParamList } from "@/constants/navigationTypes";
import ProfileFriendsNavBar from "@/components/ProfileFriendsNavBar";
import FavouriteSpotsButton from "@/components/FavouriteSpotsButton";
import BookmarksButton from "@/components/BookmarkButton";
import VisitedButton from "@/components/VisitedButton";
import { AppContext } from "@/context/AppContext";

export default function UserProfileView() {
  // Navigation hook for navigating to other screens
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { bookmarkedRestaurants, favouriteRestaurants, visitedRestaurants } =
    useContext(AppContext);
  const { user, signOut } = useAuth();

  function navigateToFavouriteSpots(): void {
    navigation.navigate("FavoriteSpotsView", {
      favouriteRestaurants,
    });
  }

  function navigateToBookmarkedSpots(): void {
    navigation.navigate("BookmarkedSpotsView", {
      bookmarkedRestaurants,
    });
  }

  function navigateToVisitedSpots(): void {
    navigation.navigate("VisitedSpotsView", {
      visitedRestaurants,
    });
  }

  function editAccount(): void {
    navigation.navigate("EditAccountView");
  }

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <TitleHeader title="Profile" />
      {/* ScrollView for scrollable content */}
      <ScrollView style={styles.scrollView}>
        <ProfileFriendsNavBar mode="profile" />
        {/* Profile Section */}
        <View style={styles.profileSection}>
          {/* User Icon */}
          <View style={styles.iconWrapper}>
            <Image
              source={require("@/assets/images/user-icon.png")}
              style={styles.profilePicture}
            />
            <TouchableOpacity style={styles.cameraIconContainer}>
              <Image
                source={require('@/assets/images/Profile pic camera.png')}
                style={styles.cameraIcon}
              />
            </TouchableOpacity>
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
          <FavouriteSpotsButton onPress={navigateToFavouriteSpots} />
          <BookmarksButton onPress={navigateToBookmarkedSpots} />
          <VisitedButton onPress={navigateToVisitedSpots} />
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
    marginTop: 120,
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
    borderRadius: 20,
  },
  editButton: {
    fontSize: 20,
    margin: 10,
    textAlign: 'center',
    marginHorizontal: 5,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: '#fff',
    backgroundColor: '#007BFF',
  },
  menuItemText: {
    marginLeft: 20,
    fontSize: 19,
    color: "#ededed",
  },
  cameraIconContainer: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    backgroundColor: '#fff',
    borderRadius: 15,
    },
});
