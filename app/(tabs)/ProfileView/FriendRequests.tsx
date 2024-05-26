import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Friend } from "@/model/Friend";
import TitleHeader from "@/components/TitleHeader";
import ProfileFriendsNavBar from "@/components/ProfileFriendsNavBar";
import { AppContext } from "@/context/AppContext";
import { RootStackParamList } from "@/constants/navigationTypes";
import { NavigationProp } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { fetchFriendRequests } from "@/controller/DatabaseHandler";

interface ListContainerProps {
  friend: Friend;
}

const ListContainer: React.FC<ListContainerProps> = ({ friend }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const handlePress = () => {
    navigation.navigate("FriendProfile", { friend });
  };
  return (
    <View style={{ borderBottomWidth: 3, borderBottomColor: "#363232" }}>
      <TouchableOpacity style={styles.listItem}>
        <Image
          resizeMode="contain"
          style={styles.listImage}
          source={{ uri: friend.profileImageUrl }}
        />
        <View style={styles.listTitleContainer}>
          <Text style={styles.listItemText}>{friend.username}</Text>
        </View>
        {/* <AntDesign name="right" style={styles.rightArrow} /> */}
      </TouchableOpacity>
    </View>
  );
};

const FriendRequestsList = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [friendRequests, setFriendRequests] = useState<Friend[]>([]);

  useEffect(() => {
    const getFriendRequests = async () => {
      const requests = await fetchFriendRequests();
      setFriendRequests(requests);
    };
    getFriendRequests();
  }, []);

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <TitleHeader title="Friends" />
      {/* ScrollView for scrollable content */}
      <View style={styles.innerContainer}>
        <ProfileFriendsNavBar mode="friends" />
        <View style={{ borderBottomWidth: 3, borderBottomColor: "#363232" }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <AntDesign name="arrowleft" style={styles.backArrow} />
          </TouchableOpacity>
        </View>
        {friendRequests.length === 0 ? (
          <View style={styles.noFriends}>
            <Text style={styles.noFriendsText}>
              You have no friend requests
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.scrollView}>
            <View style={styles.listContainer}>
              {friendRequests.map((friend) => (
                <ListContainer key={friend.uid} friend={friend} />
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default FriendRequestsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    flex: 1,
    marginTop: 120,
  },
  scrollView: {},
  listContainer: {},
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
    paddingLeft: 10,
    flex: 1,
  },
  listImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 50,
  },
  rightArrow: {
    fontSize: 35,
    color: "#363232",
  },
  noFriends: {
    flex: 1,
    justifyContent: "center",
  },
  noFriendsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#363232",
  },
  backArrow: {
    fontSize: 35,
    color: "#363232",
    padding: 10,
  },
});
