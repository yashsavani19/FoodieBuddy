import React, { useState } from "react";
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
import * as ImagePicker from 'expo-image-picker';
import Modal from 'react-native-modal';

export default function UserProfileView() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, signOut } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  function navigateToFavouriteSpots(event: GestureResponderEvent): void {
    navigation.navigate("FavoriteSpotsView");
  }

  function navigateToBookmarkedSpots(event: GestureResponderEvent): void {
    navigation.navigate("BookmarkedSpotsView");
  }

  function navigateToVisitedSpots(event: GestureResponderEvent): void {
    navigation.navigate("VisitedSpotsView");
  }

  function editAccount(event: GestureResponderEvent): void {
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
      setSelectedImage(result.uri);
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
      setSelectedImage(result.uri);
      toggleModal();
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    toggleModal();
  };

  return (
    <View style={styles.container}>
      <TitleHeader title="Profile" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <View style={styles.iconWrapper}>
            <TouchableOpacity onPress={toggleModal}>
              <Image
                source={selectedImage ? { uri: selectedImage } : require("@/assets/images/user-icon.png")}
                style={styles.profilePicture}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.username}>{user?.displayName || ""}</Text>
          <View style={styles.accountActions}>
            <TouchableOpacity onPress={editAccount}>
              <Text style={styles.editButton}>Edit Account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={signOut}>
              <Text style={styles.editButton}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.menuItemsSection}>
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
  savedIcons: {
    width: 35, 
    height: 35, 
    resizeMode: "contain",
    marginRight: 20,
  },
  menuItemText: {
    marginLeft: 20,
    fontSize: 19,
    color: "#ededed",
  },
  rightArrow: {
    position: "absolute",
    right: 20,
    fontSize: 35,
    color: "#ededed",
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

