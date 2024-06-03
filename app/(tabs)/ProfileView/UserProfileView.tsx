import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal as RNModal,
  Platform,
} from "react-native";
import TitleHeader from "@/components/TitleHeader";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";
import { AntDesign } from "@expo/vector-icons";
import { RootStackParamList } from "@/constants/navigationTypes";
import ProfileFriendsNavBar from "@/components/ProfileFriendsNavBar";
import FavouriteSpotsButton from "@/components/SavedLists/FavouriteSpotsButton";
import BookmarksButton from "@/components/SavedLists/BookmarkButton";
import VisitedButton from "@/components/SavedLists/VisitedButton";
import { AppContext } from "@/context/AppContext";
import * as ImagePicker from "expo-image-picker";
import ReactNativeModal from "react-native-modal";
import {
  uploadProfilePicture,
  updateProfilePicture,
  fetchUser,
  deleteProfilePicture,
} from "@/controller/ProfilePictureHandler";
import PreferencesButton from "@/components/SavedLists/PreferencesButton";
import Constants from "expo-constants";

export default function UserProfileView() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {
    bookmarkedRestaurants,
    favouriteRestaurants,
    visitedRestaurants,
    preferences,
  } = useContext(AppContext);
  const { user, signOut } = useAuth();

  const [isModalVisible, setModalVisible] = useState(false);
  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageToConfirm, setImageToConfirm] = useState<string | null>(null);
  const [isImageViewerVisible, setImageViewerVisible] = useState(false);

  useEffect(() => {
    const loadProfilePicture = async () => {
      const userId = user?.uid;
      if (userId) {
        const userData = await fetchUser(userId);
        if (userData?.profileImageUrl) {
          setSelectedImage(userData.profileImageUrl);
        }
      }
    };

    loadProfilePicture();
  }, [user]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus.status !== "granted") {
          alert("Sorry, we need camera permissions to make this work!");
        }
      }
    })();
  }, []);

  function navigateToFoodPreferences(): void {
    navigation.navigate("FoodPreferencesView");
  }

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
    if (Platform.OS === "ios") {
      alert("Setting a profile image is not yet supported on iOS");
      return;
    }
    setModalVisible(!isModalVisible);
  };

  const toggleConfirmationModal = () => {
    setConfirmationModalVisible(!isConfirmationModalVisible);
  };

  // Image Picker Functions
  const pickImageFromCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageToConfirm(result.assets[0].uri);
      toggleModal();
      toggleConfirmationModal();
    }
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      console.log(result.assets[0].uri);
      setImageToConfirm(result.assets[0].uri);
      toggleModal();
      toggleConfirmationModal();
    }
  };

  const confirmImage = async () => {
    if (imageToConfirm) {
      const userId = user?.uid;
      if (userId) {
        const profileImageUrl = await uploadProfilePicture(
          imageToConfirm,
          userId
        );
        if (profileImageUrl) {
          await updateProfilePicture(userId, profileImageUrl);
          setSelectedImage(profileImageUrl);
        }
      }
    }
    setImageToConfirm(null);
    toggleConfirmationModal();
  };

  const removeImage = async () => {
    const userId = user?.uid;
    if (userId) {
      await deleteProfilePicture(userId);
      setSelectedImage(null);
    }
    toggleModal();
  };

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <TitleHeader title="Profile" startupGuide={ true} />
      {/* ScrollView for scrollable content */}
      <ScrollView style={styles.scrollView}>
        <ProfileFriendsNavBar mode="profile" />
        {/* Profile Section */}
        <View style={styles.profileSection}>
          {/* User Icon */}
          <View style={styles.iconWrapper}>
            <TouchableOpacity onPress={() => setImageViewerVisible(true)}>
              <Image
                source={
                  selectedImage
                    ? { uri: selectedImage }
                    : require("@/assets/images/user-icon.png")
                }
                style={styles.profilePicture}
              />
            </TouchableOpacity>
            {Platform.OS === "ios" ? null : (
              <TouchableOpacity
                style={styles.cameraIconContainer}
                onPress={toggleModal}
              >
                <Image
                  source={require("@/assets/images/Change_PFP_icon.png")}
                  style={styles.cameraIcon}
                />
              </TouchableOpacity>
            )}
          </View>
          {/* User Display Name */}
          <Text style={styles.username}>{user?.displayName || ""}</Text>
          {/* Account Actions (e.g., Logout) */}
          <View style={styles.accountActions}>
            {/* Edit Account Button */}
            <TouchableOpacity
              style={styles.editButtonContainer}
              onPress={editAccount}
            >
              <Text style={styles.editButton}>Edit Account</Text>
            </TouchableOpacity>
            {/* Logout Button */}
            <TouchableOpacity
              style={styles.editButtonContainer}
              onPress={signOut}
            >
              <Text style={styles.editButton}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Menu Items Section */}
        <View style={styles.menuItemsSection}>
          {/* Food Preferences Button */}
          <PreferencesButton onPress={navigateToFoodPreferences} />

          {/* Favorite Spots Button */}
          <FavouriteSpotsButton onPress={navigateToFavouriteSpots} />

          {/* Bookmarked Spots Button */}
          <BookmarksButton onPress={navigateToBookmarkedSpots} />

          {/* Visited Spots Button */}
          <VisitedButton onPress={navigateToVisitedSpots} />
        </View>
      </ScrollView>
      <ReactNativeModal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Profile Photo</Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={pickImageFromCamera}
            >
              <AntDesign name="camerao" size={24} color="black" />
              <Text style={styles.modalButtonText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={pickImageFromGallery}
            >
              <AntDesign name="picture" size={24} color="black" />
              <Text style={styles.modalButtonText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={removeImage}>
              <AntDesign name="delete" size={24} color="black" />
              <Text style={styles.modalButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ReactNativeModal>
      <ReactNativeModal
        isVisible={isConfirmationModalVisible}
        onBackdropPress={toggleConfirmationModal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirm Photo</Text>
          <Image
            source={
              imageToConfirm
                ? { uri: imageToConfirm }
                : require("@/assets/images/Change_PFP_icon.png")
            }
            style={styles.confirmImage}
          />

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={confirmImage}>
              <AntDesign name="check" size={24} color="black" />
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={toggleConfirmationModal}
            >
              <AntDesign name="close" size={24} color="black" />
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ReactNativeModal>
      <RNModal
        visible={isImageViewerVisible}
        transparent={true}
        onRequestClose={() => setImageViewerVisible(false)}
      >
        <View style={styles.imageViewerContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setImageViewerVisible(false)}
          >
            <AntDesign name="close" size={30} color="white" />
          </TouchableOpacity>
          <Image
            source={
              selectedImage
                ? { uri: selectedImage }
                : require("@/assets/images/user-icon.png")
            }
            style={styles.imageViewer}
          />
        </View>
      </RNModal>
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
    marginTop: Constants.statusBarHeight + 100,
  },
  profileSection: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 10,
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
    textAlign: "center",
    color: "#fff",
  },
  editButtonContainer: {
    margin: 10,
    marginHorizontal: 5,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#007BFF",
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
    fontSize: 15,
    color: "#000",
  },
  menuItemText: {
    marginLeft: 20,
    fontSize: 19,
    color: "#ededed",
  },
  cameraIconContainer: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderRadius: 50,
  },
  cameraIcon: {
    width: 35,
    height: 35,
    resizeMode: "contain",
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
  confirmImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  imageViewerContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageViewer: {
    width: "90%",
    height: "80%",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
  },
});
