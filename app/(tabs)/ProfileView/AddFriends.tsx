import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
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
import { set } from "firebase/database";
import Constants from "expo-constants";

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
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { friends, getFriends } = useContext(AppContext);
  const { user } = useAuth();

  const handleAddFriend = async () => {
    await addFriend(friend);
    await getFriends();
    alert("Friend request sent to " + friend.username);
    navigation.goBack();
  };

  const buttonText =
    // check if friend.uid is in the friends.uid list
    friends.find((f) => f.uid === friend.uid) !== undefined
      ? "Already friends"
      : "Add friend";
  const buttonDisabled =
    friends.find((f) => f.uid === friend.uid) !== undefined;

  useEffect(() => {
    console.log("Friend: " + friend.uid);
    console.log("Friends: " + friends.map((f) => f.username));
  }, [friend]);

  if (friend.uid === user?.uid) {
    return null;
  }

  return (
    <View style={{ borderBottomWidth: 3, borderBottomColor: "#363232" }}>
      <TouchableOpacity
        style={styles.listItem}
        onPress={onPress}
        disabled={true}
      >
        <Image
          // resizeMode="contain"
          style={styles.listImage}
          source={
            typeof friend.profileImageUrl === "string"
              ? { uri: friend.profileImageUrl }
              : friend.profileImageUrl
          }
        />
        <View style={styles.listTitleContainer}>
          <Text style={styles.listItemText}>{friend.username}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.addButton,
            {
              backgroundColor: buttonDisabled ? "#c0c0c0" : "#363232",
            },
          ]}
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
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const onSearchSubmit = async (searchQuery: string) => {
    if (searchQuery === "") return;
    setFoundUsers(null);
    setHasSearched(true);
    const users = await searchUsername(searchQuery);
    setFoundUsers(users);
  };

  useEffect(() => {
    if (searchQuery === "") {
      setFoundUsers(null);
      setHasSearched(false);
    }
  }, [searchQuery]);

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
            <TouchableOpacity
              onPress={() => {
                onSearchSubmit(searchQuery);
              }}
            >
              <AntDesign name="search1" style={styles.searchIcon} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.listContainer}>
          {foundUsers ? (
            <ListContainer friend={foundUsers} />
          ) : (
            !foundUsers &&
            hasSearched && (
              <Text style={styles.noUsersText}>No users found</Text>
            )
          )}
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
    marginTop: Constants.statusBarHeight + 100,
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
    borderRadius: 50,
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
  noUsersText: {
    textAlign: "center",
    fontSize: 16,
    color: "#363232",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#363232",
    marginLeft: 10,
  },
  addButton: {
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
