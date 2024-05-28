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
import {
  confirmFriendRequest,
  fetchFriendRequests,
  rejectFriendRequest,
  removeSentFriendRequest,
} from "@/controller/DatabaseHandler";

interface FriendRequestProps {
  friend: Friend;
  onPress: () => void;
}

const FriendRequest: React.FC<FriendRequestProps> = ({ friend, onPress }) => {
  const { getFriends } = useContext(AppContext);
  const acceptRequest = async () => {
    await confirmFriendRequest(friend);
    await getFriends();
    onPress();
  };

  const rejectRequest = async () => {
    await rejectFriendRequest(friend);
    await getFriends();
    onPress();
  };

  return (
    <View style={{ borderBottomWidth: 3, borderBottomColor: "#363232" }}>
      <View style={styles.listItem}>
        <Image
          resizeMode="contain"
          style={styles.listImage}
          source={{ uri: friend.profileImageUrl }}
        />
        <View style={styles.listTitleContainer}>
          <Text style={styles.listItemText}>{friend.username}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#4B8DEF" }]}
            onPress={acceptRequest}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#CC4343" }]}
            onPress={rejectRequest}
          >
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const SentRequest: React.FC<FriendRequestProps> = ({ friend, onPress }) => {
  const removeRequest = async () => {
    await removeSentFriendRequest(friend);
    onPress();
  };

  return (
    <View style={{ borderBottomWidth: 3, borderBottomColor: "#363232" }}>
      <View style={styles.listItem}>
        <Image
          resizeMode="contain"
          style={styles.listImage}
          source={{ uri: friend.profileImageUrl }}
        />
        <View style={styles.listTitleContainer}>
          <Text style={styles.listItemText}>{friend.username}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#CC4343" }]}
            onPress={removeRequest}
          >
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const FriendRequestsList = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [friendRequests, setFriendRequests] = useState<Friend[]>([]);
  const [sentRequests, setSentRequests] = useState<Friend[]>([]);
  const { getFriends } = useContext(AppContext);

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = async () => {
    const requests = await fetchFriendRequests();
    setFriendRequests(requests.receivedRequests);
    setSentRequests(requests.sentRequests);
    getFriends();
  };

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <TitleHeader title="Friends" />
      {/* ScrollView for scrollable content */}
      <View style={styles.innerContainer}>
        <ProfileFriendsNavBar mode="friends" />
        <View
          style={{
            marginBottom: 10,
            borderBottomWidth: 3,
            borderBottomColor: "#363232",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <AntDesign name="arrowleft" style={styles.backArrow} />
          </TouchableOpacity>
          <Text style={[styles.listItemText, { marginLeft: 15 }]}>
            Friend Requests
          </Text>
        </View>
        <ScrollView style={styles.scrollView}>
          {friendRequests.length === 0 ? (
            <View style={styles.noFriends}>
              <Text style={styles.noFriendsText}>
                You have no friend requests
              </Text>
            </View>
          ) : (
            <View style={styles.listContainer}>
              {friendRequests.map((friend) => (
                <FriendRequest
                  key={friend.uid}
                  friend={friend}
                  onPress={refreshList}
                />
              ))}
            </View>
          )}
          <View
            style={{
              marginTop: 10,
              marginBottom: 10,
              borderBottomWidth: 3,
              borderBottomColor: "#363232",
            }}
          >
            <Text style={[styles.listItemText, { marginLeft: 15 }]}>
              Sent Requests
            </Text>
          </View>
          {sentRequests.length === 0 ? (
            <View style={styles.noFriends}>
              <Text style={styles.noFriendsText}>
                You have no sent friend requests
              </Text>
            </View>
          ) : (
            <View style={styles.listContainer}>
              {sentRequests.map((friend) => (
                <SentRequest
                  key={friend.uid}
                  friend={friend}
                  onPress={refreshList}
                />
              ))}
            </View>
          )}
        </ScrollView>
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
  button: {
    padding: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    margin: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
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
