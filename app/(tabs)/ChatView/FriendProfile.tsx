import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect } from "react";
import TitleHeader from "@/components/TitleHeader";
import ProfileFriendsNavBar from "@/components/ProfileFriendsNavBar";
import { Friend } from "@/model/Friend";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { NavigationProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/navigationTypes";
import FavouriteSpotsButton from "@/components/FavouriteSpotsButton";
import VisitedButton from "@/components/VisitedButton";
import BookmarksButton from "@/components/BookmarkButton";
import {
  fetchFriendsBookmarks,
  fetchFriendsFavourites,
  fetchFriendsVisited,
  removeFriend,
} from "@/controller/DatabaseHandler";
import { AppContext } from "@/context/AppContext";
import Constants from "expo-constants";

const FriendProfile: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { getFriends } = useContext(AppContext);
  const route = useRoute();
  const friend = (route.params as any).friend as Friend;

  useEffect(() => {
    console.log("FriendProfile: ", friend);
  }, []);

  const handleFriendsFavourites = async () => {
    console.log("Friends Favourites");
    const friendsFavourites = await fetchFriendsFavourites(friend.uid);
    console.log("Friends Favourites: ", friendsFavourites);
    if (friendsFavourites) {
      navigation.navigate("FavoriteSpotsView", {
        favouriteRestaurants: friendsFavourites,
      });
    }
  };

  const handleFriendsBookmarks = async () => {
    console.log("Friends Bookmarks");
    const friendsBookmarks = await fetchFriendsBookmarks(friend.uid);
    if (friendsBookmarks) {
      navigation.navigate("BookmarkedSpotsView", {
        bookmarkedRestaurants: friendsBookmarks,
      });
    }
  };

  const handleFriendsVisited = async () => {
    console.log("Friends Visited");
    const friendsVisited = await fetchFriendsVisited(friend.uid);
    if (friendsVisited) {
      navigation.navigate("VisitedSpotsView", {
        visitedRestaurants: friendsVisited,
      });
    }
  };

  const unfriend = async () => {
    await removeFriend(friend);
    await getFriends();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TitleHeader title={friend.username} />
      <ScrollView style={styles.scrollView}>
        <ProfileFriendsNavBar mode="friends" />
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <AntDesign name="arrowleft" style={styles.backArrow} />
          </TouchableOpacity>
        </View>
        <View>
          <View style={styles.imageNameContainer}>
            <Image
              resizeMode="contain"
              style={styles.profileImage}
              source={
                typeof friend.profileImageUrl === 'string'
                  ? { uri: friend.profileImageUrl }
                  : friend.profileImageUrl
              }
            />
            <Text style={{ fontSize: 24, fontWeight: "600" }}>
              {friend.username}
            </Text>
            <TouchableOpacity style={styles.unfriendButton} onPress={unfriend}>
              <Text style={{ color: "#fff", fontWeight: "600" }}>Unfriend</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.savedContainer}>
          <FavouriteSpotsButton onPress={handleFriendsFavourites} />
          <BookmarksButton onPress={handleFriendsBookmarks} />
          <VisitedButton onPress={handleFriendsVisited} />
        </View>
      </ScrollView>
    </View>
  );
};

export default FriendProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    marginTop: Constants.statusBarHeight + 100,
  },
  backArrow: {
    fontSize: 35,
    color: "#363232",
    padding: 10,
  },
  imageNameContainer: {
    alignItems: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
  },
  unfriendButton: {
    backgroundColor: "#CC4343",
    padding: 8,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 10,
  },
  savedContainer: {
    marginTop: 20,
  },
});
