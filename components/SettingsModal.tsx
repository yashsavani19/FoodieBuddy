import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Friend } from "@/model/Friend";
import {
  fetchFriends,
  addFriendToChatRoom,
  removeFriendFromChatRoom,
} from "@/controller/DatabaseHandler";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  chatRoomId: string;
  currentFriends: string[];
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  chatRoomId,
  currentFriends,
}) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatedFriends, setUpdatedFriends] = useState<string[]>([]);

  useEffect(() => {
    const fetchFriendsData = async () => {
      setIsLoading(true);
      const friendsData = await fetchFriends();
      setFriends(friendsData);
      setIsLoading(false);
      setUpdatedFriends(currentFriends);
    };

    fetchFriendsData();
  }, [currentFriends]);

  const handleAddFriend = async (friendId: string) => {
    await addFriendToChatRoom(chatRoomId, friendId);
    setUpdatedFriends([...updatedFriends, friendId]);
  };

  const handleRemoveFriend = async (friendId: string) => {
    await removeFriendFromChatRoom(chatRoomId, friendId);
    setUpdatedFriends(updatedFriends.filter((id) => id !== friendId));
  };

  return (
    <TouchableWithoutFeedback onPress={onClose}>
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.modalTitle}>Settings</Text>
            </View>
            <View style={styles.separator} />
            <Text style={styles.sectionTitle}>Friends</Text>
            {isLoading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <FlatList
                data={friends}
                keyExtractor={(item) => item.uid}
                renderItem={({ item }) => (
                  <View style={styles.friendItem}>
                    <Image
                      source={
                        typeof item.profileImageUrl === "string"
                          ? { uri: item.profileImageUrl }
                          : item.profileImageUrl
                      }
                      style={styles.profileImage}
                    />
                    <Text style={styles.friendName}>{item.username}</Text>
                    {updatedFriends.includes(item.uid) ? (
                      <TouchableOpacity
                        onPress={() => handleRemoveFriend(item.uid)}
                        style={[styles.button, styles.removeButton]}
                      >
                        <Text style={styles.removeButtonText}>Added</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => handleAddFriend(item.uid)}
                        style={[styles.button, styles.addButton]}
                      >
                        <Text style={styles.addButtonText}>Add</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                contentContainerStyle={styles.flatListContentContainer}
                scrollEnabled={true}
              />
            )}
            <View style={styles.separator} />
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
    </Modal>
      </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: wp("80%"),
    backgroundColor: "#fff",
    borderRadius: wp("2.5%"),
    padding: wp("5%"),
    alignItems: "center",
    maxHeight: hp("60%"),
  },
  titleContainer: {
    width: "100%",
    paddingVertical: hp("1.5%"),
    backgroundColor: "#000",
    alignItems: "center",
    borderRadius: wp("2.5%"),
  },
  modalTitle: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "#fff",
  },
  sectionTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "600",
    marginVertical: hp("2%"),
  },
  modalItem: {
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("5%"),
    width: "100%",
    alignItems: "center",
  },
  modalItemText: {
    fontSize: wp("4%"),
  },
  friendItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("2%"),
    backgroundColor: "#f9f9f9",
    borderRadius: wp("2%"),
    marginVertical: hp("0.5%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  profileImage: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    marginRight: wp("2.5%"),
  },
  friendName: {
    fontSize: wp("4%"),
    flex: 1,
  },
  button: {
    flex: 1,
    padding: hp("1.2%"),
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: wp("1%"),
  },
  addButton: {
    backgroundColor: "#007BFF",
  },
  addButtonText: {
    color: "#fff",
  },
  removeButton: {
    backgroundColor: "#ccc",
  },
  removeButtonText: {
    color: "#000",
  },
  flatListContentContainer: {
    paddingBottom: hp("2%"),
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#ddd",
    marginVertical: hp("1%"),
  },
  closeButton: {
    width: "100%",
    paddingVertical: hp("1.5%"),
    backgroundColor: "#000",
    alignItems: "center",
    borderRadius: wp("2.5%"),
  },
  closeButtonText: {
    color: "#fff",
    fontSize: wp("4%"),
  },
});

export default SettingsModal;
