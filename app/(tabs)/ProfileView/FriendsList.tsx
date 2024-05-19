import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { Friend } from "@/model/Friend";
import TitleHeader from "@/components/TitleHeader";
import ProfileFriendsNavBar from "@/components/ProfileFriendsNavBar";

interface ListContainerProps {
  friend: Friend;
}

const friendImages: { [key: string]: any } = {
  friendsList: require("@/assets/images/friends_icon.png"),
  friendsRequest: require("@/assets/images/friend-request_icon.png"),
  addFriends: require("@/assets/images/add-friend_icon.png"),
};

const ListContainer: React.FC<ListContainerProps> = ({ friend }) => {
  return (
    <View style={{ borderBottomWidth: 3, borderBottomColor: "#363232" }}>
      <TouchableOpacity style={styles.listItem}>
        <Image resizeMode="contain" style={styles.listImage} source={{}} />
        <View style={styles.listTitleContainer}>
          <Text style={styles.listItemText}>{friend.username}</Text>
        </View>
        <AntDesign name="right" style={styles.rightArrow} />
      </TouchableOpacity>
    </View>
  );
};

const FriendsList = () => {
  return (
    <View style={styles.container}>
      {/* Title Header */}
      <TitleHeader title="Friends" />
      {/* ScrollView for scrollable content */}
      <ScrollView style={styles.scrollView}>
        <ProfileFriendsNavBar mode="friends" />
        <ListContainer friend={{ uid: "1", username: "John Doe" }} />
        <ListContainer friend={{ uid: "2", username: "Jane Doe" }} />
        <ListContainer friend={{ uid: "3", username: "John Smith" }} />
      </ScrollView>
    </View>
  );
};

export default FriendsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    marginTop: 120,
  },
  listContainer: {
    flex: 1,
  },
  listItem: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: 10,

    height: 80,
  },
  listItemText: {
    fontSize: 16,
    fontWeight: "600",
  },
  listTitleContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  listImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  rightArrow: {
    fontSize: 35,
    color: "#363232",
  },
});
