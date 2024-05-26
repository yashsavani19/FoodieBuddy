import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import TitleHeader from "@/components/TitleHeader";
import ProfileFriendsNavBar from "@/components/ProfileFriendsNavBar";
import { AntDesign } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/navigationTypes";

interface ListContainerProps {
  mode: "friendsList" | "friendsRequest" | "addFriends";
  onPress?: () => void;
}

const friendImages: { [key: string]: any } = {
  friendsList: require("@/assets/images/friends_icon.png"),
  friendsRequest: require("@/assets/images/friend-request_icon.png"),
  addFriends: require("@/assets/images/add-friend_icon.png"),
};

const ListContainer: React.FC<ListContainerProps> = ({ mode, onPress }) => {
  const title =
    mode === "friendsList"
      ? "Friends List"
      : mode === "friendsRequest"
      ? "Friend Requests"
      : "Add Friends";
  return (
    <View style={{ borderBottomWidth: 3, borderBottomColor: "#363232" }}>
      <TouchableOpacity style={styles.listItem} onPress={onPress}>
        <Image
          resizeMode="contain"
          style={styles.listImage}
          source={friendImages[mode]}
        />
        <View style={styles.listTitleContainer}>
          <Text style={styles.listItemText}>{title}</Text>
        </View>
        <AntDesign name="right" style={styles.rightArrow} />
      </TouchableOpacity>
    </View>
  );
};

const FriendsView = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View style={styles.container}>
      {/* Title Header */}
      <TitleHeader title="Friends" />
      {/* ScrollView for scrollable content */}
      <View style={{ marginTop: 120 }}>
        <ProfileFriendsNavBar mode="friends" />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.listContainer}>
          <ListContainer
            mode="friendsList"
            onPress={() => {
              navigation.navigate("FriendsList");
            }}
          />
          <ListContainer
            mode="friendsRequest"
            onPress={() => {
              navigation.navigate("FriendRequests");
            }}
          />
          <ListContainer
            mode="addFriends"
            onPress={() => {
              navigation.navigate("AddFriends");
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default FriendsView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    // marginTop: 120,
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
    fontSize: 18,
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
