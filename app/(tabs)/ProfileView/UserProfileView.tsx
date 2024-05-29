import React, { useContext, useState } from "react";
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
import * as ImagePicker from 'expo-image-picker';
import Modal from 'react-native-modal';
import AntDesign from "@expo/vector-icons/build/AntDesign";

export default function UserProfileView() {
  // Navigation hook for navigating to other screens
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { bookmarkedRestaurants, favouriteRestaurants, visitedRestaurants } =
    useContext(AppContext);
  const { user, signOut } = useAuth();

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const pickImageFromCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      toggleModal();
    }
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      toggleModal();
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    toggleModal();
  };

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
            <TouchableOpacity onPress={toggleModal}>
              <Image
                source={selectedImage ? { uri: selectedImage } : require("@/assets/images/user-icon.png")}
                style={styles.profilePicture}
              />
              <TouchableOpacity style={styles.cameraIconContainer}>
                <Image
                  source={require('@/assets/images/Profile pic camera.png')}
                  style={styles.cameraIcon}
                />
              </TouchableOpacity>
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
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Profile Photo</Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={pickImageFromCamera}>
              <AntDesign name="camerao" size={24} color="black" />
              <Text style={styles.modalButtonText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={pickImageFromGallery}>
              <AntDesign name="picture" size={24} color="black" />
              <Text style={styles.modalButtonText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={removeImage}>
              <AntDesign name="delete" size={24} color="black" />
              <Text style={styles.modalButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    borderRadius: 50,
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
    textAlign: 'center',
    marginHorizontal: 5,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: '#fff',
    backgroundColor: '#007BFF',
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
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    alignItems: "center",
    marginHorizontal: 20,
  },
  modalButtonText: {
    marginTop: 10,
    fontSize: 16,
  },
});
