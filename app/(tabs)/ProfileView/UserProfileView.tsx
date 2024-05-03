import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, GestureResponderEvent } from 'react-native';
import TitleHeader from "@/components/TitleHeader";
import { AntDesign, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { RootStackParamList } from '@/constants/navigationTypes';

export default function UserProfileView() {
  // Navigation hook for navigating to other screens
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, signOut } = useAuth(); // Use auth hook here

  function navigateToFavouriteSpots(event: GestureResponderEvent): void {
    // Assuming 'navigation' is already defined using the useNavigation hook
    navigation.navigate('FavoriteSpotsView');
  }

  function navigateToBookmarkedSpots(event: GestureResponderEvent): void {
    // Assuming 'navigation' is already defined using the useNavigation hook
    navigation.navigate('BookmarkedSpotsView');
  }
  
  function navigateToVisitedSpots(event: GestureResponderEvent): void {
    // Assuming 'navigation' is already defined using the useNavigation hook
    navigation.navigate('VisitedSpotsView');
  }

  return (
    <View style={styles.container}>
      <TitleHeader title="Profile" />
      <ScrollView style={styles.scrollView}>
      <View style={styles.profileSection}>
          <View style={styles.iconWrapper}>
            <Image
              source={require("@/assets/images/user-icon.png")} // Correct image path
              style={styles.profilePicture}
            />
          </View>
          <Text style={styles.username}>{user?.displayName || ""}</Text>
          <View style={styles.accountActions}>
            {/* <TouchableOpacity
              // onPress={{}}
              style={styles.editButton}
            >
              <Text style={{ fontSize: 20 }}>Edit Account</Text>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={signOut}>
              <Text style={{ fontSize: 20 }}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menuItemsSection}>
          <TouchableOpacity onPress={navigateToFavouriteSpots} style={styles.menuItem}>
            <Image
              source={require("@/assets/images/fave-Selected.png")} // Correct image path
              style={styles.savedIcons}
            />
            <Text style={styles.menuItemText}>Favorite Spots</Text>
            <AntDesign name="right" style={styles.rightArrow} />
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateToBookmarkedSpots} style={styles.menuItem}>
            <Image
              source={require("@/assets/images/bookmark-Selected.png")} // Correct image path
              style={styles.savedIcons}
            />
            <Text style={styles.menuItemText}>Bookmarked Spots</Text>
            <AntDesign name="right" style={styles.rightArrow} />
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateToVisitedSpots} style={styles.menuItem}>
            <Image
              source={require("@/assets/images/visited-Selected.png")} // Correct image path
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
    paddingVertical: 10,
  },
  editButton: {
    fontSize: 25,
    marginRight: 20,
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
