import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Image,
} from "react-native";
import { subscribeToFriends } from "@/controller/DatabaseHandler"; 
import { Friend as FriendModel } from "@/model/Friend"; 

interface Friend {
  id: string;
  name: string;
  avatar: string;
  isAdded: boolean;
}

interface CreateChatRoomModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: () => Promise<void>;
  newChatRoomName: string;
  setNewChatRoomName: (name: string) => void;
  newChatRoomImageUrl: string;
  setNewChatRoomImageUrl: (url: string) => void;
  friends: Friend[];
  toggleFriendAdded: (id: string) => void;
}


const CreateChatRoomModal: React.FC<CreateChatRoomModalProps> = ({
  visible,
  onClose,
  onCreate,
  newChatRoomName,
  setNewChatRoomName,
  newChatRoomImageUrl,
  setNewChatRoomImageUrl,
}) => {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    if (visible) {
      // Subscribe to friends when the modal is visible
      const unsubscribe = subscribeToFriends((friendsList) => {
        const friends = friendsList.map((friend: FriendModel) => ({
          id: friend.uid,
          name: friend.username,
          avatar: friend.profileImageUrl || '',
          isAdded: false,
        }));
        setFriends(friends);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [visible]);

  const toggleFriendAdded = (id: string) => {
    setFriends((prevFriends) =>
      prevFriends.map((friend) =>
        friend.id === id ? { ...friend, isAdded: !friend.isAdded } : friend
      )
    );
  };

  const renderFriend = ({ item }: { item: Friend }) => (
    <View style={styles.friendContainer}>
      <Image source={{ uri: item.avatar }} style={styles.friendAvatar} />
      <Text style={styles.friendName}>{item.name}</Text>
      <TouchableOpacity
        style={[styles.addButton, item.isAdded && styles.addedButton]}
        onPress={() => toggleFriendAdded(item.id)}
      >
        <Text style={[styles.addButtonText, item.isAdded && styles.addedButtonText]}>
          {item.isAdded ? "Added" : "Add"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const sortedFriends = friends.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <TouchableOpacity style={styles.modalBackground} onPress={onClose} activeOpacity={1}>
          <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>
            <Text style={styles.modalTitle}>Create New Chat Room</Text>
            <TextInput
              style={styles.input}
              placeholder="Chat Room Name"
              value={newChatRoomName}
              onChangeText={setNewChatRoomName}
            />
            <TextInput
              style={styles.input}
              placeholder="Image URL (optional)"
              value={newChatRoomImageUrl}
              onChangeText={setNewChatRoomImageUrl}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.friendsTitle}>Friends</Text>
            <FlatList
              data={sortedFriends}
              renderItem={renderFriend}
              keyExtractor={(item) => item.id}
              style={styles.friendsList}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
                <Text style={styles.cancelButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onCreate} style={[styles.button, styles.createButton]}>
                <Text style={styles.createButtonText}>Create Chat</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBackground: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    height: 500,
    width: 320,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  friendsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  friendsList: {
    width: "100%",
    marginBottom: 10,
  },
  friendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  friendName: {
    flex: 1,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  addedButton: {
    backgroundColor: "#ccc",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 12,
  },
  addedButtonText: {
    color: "#000",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  createButton: {
    backgroundColor: "#007BFF",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#000",
  },
  createButtonText: {
    color: "#fff",
  },
});

export default CreateChatRoomModal;
