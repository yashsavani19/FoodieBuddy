import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import TitleHeader from "@/components/TitleHeader";
import ProfileFriendsNavBar from "@/components/ProfileFriendsNavBar";
import { AntDesign } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/navigationTypes";
import { Friend } from "@/model/Friend";
import {
  addFriend,
  fetchFriends,
  searchUsername,
} from "@/controller/DatabaseHandler";
import { AppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

interface ListContainerProps {
  friend: Friend;
  onPress?: () => void;
}

const friendImages: { [key: string]: any } = {
  friendsList: require("@/assets/images/friends_icon.png"),
  friendsRequest: require("@/assets/images/friend-request_icon.png"),
  addFriends: require("@/assets/images/add-friend_icon.png"),
};

const ListContainer: React.FC<ListContainerProps> = ({ friend, onPress }) => {
  const { getFriends } = useContext(AppContext);
  const handleAddFriend = async () => {
    await addFriend(friend);
    await getFriends();
  };
  const { user } = useAuth();
  const { friends } = useContext(AppContext);

  const buttonText =
    user?.uid === friend.uid
      ? "This is you idiot"
      : friends.includes(friend)
      ? "Already friends"
      : "Add friend";
  const buttonDisabled = (user?.uid === friend.uid) || friends.includes(friend);

  return (
    <View style={{ borderBottomWidth: 3, borderBottomColor: "#363232" }}>
      <TouchableOpacity
        style={styles.listItem}
        onPress={onPress}
        disabled={true}
      >
        <Image
          resizeMode="contain"
          style={styles.listImage}
          source={{ uri: friend.profileImageUrl }}
        />
        <View style={styles.listTitleContainer}>
          <Text style={styles.listItemText}>{friend.username}</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddFriend}
          disabled={buttonDisabled}
        >
          <Text style={styles.addButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const AddFriends = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [foundUsers, setFoundUsers] = useState<Friend | null>();
  const { user } = useAuth();

  const onSearchSubmit = async (searchQuery: string) => {
    const users = await searchUsername(searchQuery, user?.uid || "");
    setFoundUsers(users);
  };

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <TitleHeader title="Add Friends" />
      {/* ScrollView for scrollable content */}
      <ScrollView style={styles.scrollView}>
        <ProfileFriendsNavBar mode="friends" />
        <View style={styles.searchContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <AntDesign name="arrowleft" style={styles.rightArrow} />
            </TouchableOpacity>
            <Text style={styles.headerText}>Find by username</Text>
          </View>
          <View style={styles.searchBar}>
            <AntDesign name="search1" style={styles.searchIcon} />
            <TextInput
              placeholder="Search"
              style={styles.searchInput}
              placeholderTextColor="#363232"
              selectTextOnFocus={true}
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
              onSubmitEditing={() => {
                onSearchSubmit(searchQuery);
              }}
            />
          </View>
        </View>
        <View style={styles.listContainer}>
          {foundUsers && <ListContainer friend={foundUsers} />}
        </View>
      </ScrollView>
    </View>
  );
};

export default AddFriends;

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
    paddingLeft: 10,
    flex: 1,
  },
  listImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    marginLeft: 5,
  },
  rightArrow: {
    fontSize: 35,
    color: "#363232",
  },
  searchIcon: {
    marginHorizontal: 8,
    fontSize: 20,
    color: "#363232",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
  },
  headerText: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  searchContainer: {
    borderBottomWidth: 3,
    borderBottomColor: "#363232",
  },
  searchBar: {
    borderRadius: 20,
    borderWidth: 2,
    marginBottom: 20,
    marginHorizontal: 40,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#363232",
  },
  addButton: {
    backgroundColor: "#4B8DEF",
    padding: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
