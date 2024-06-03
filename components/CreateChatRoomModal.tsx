import React, { useState } from "react";
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
  Alert,
} from "react-native";
import FriendItem from "./FriendChatItem";
import { Friend } from "@/model/ChatFriend";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

// interface Friend {
//   id: string;
//   name: string;
//   avatar: string;
//   isAdded: boolean;
// }

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
  friends,
  toggleFriendAdded,
}) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const sortedFriends = friends.sort((a, b) => a.name.localeCompare(b.name));

  const handleCreate = async () => {
    if (!newChatRoomName.trim()) {
      setAlertMessage("Chat Room Name is required.");
      setAlertVisible(true);
      return;
    }
    if (!friends.some((friend) => friend.isAdded)) {
      setAlertMessage("At Least one friend must be added.");
      setAlertVisible(true);
      return;
    }
    await onCreate();
  };

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
        <View style={styles.modalBackground}>
          <TouchableOpacity
            style={styles.closeTouchable}
            onPress={onClose}
            activeOpacity={1}
          />
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create New Chat Room </Text>
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
            <Text style={styles.friendsTitle}>Friends </Text>
            <FlatList
              data={sortedFriends}
              renderItem={({ item }) => (
                <FriendItem
                  friend={item}
                  toggleFriendAdded={toggleFriendAdded}
                />
              )}
              keyExtractor={(item) => item.id}
              style={styles.friendsList}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.button, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Close </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreate}
                style={[styles.button, styles.createButton]}
              >
                <Text style={styles.createButtonText}>Create Chat </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
      <Modal
        transparent={true}
        visible={alertVisible}
        onRequestClose={() => setAlertVisible(false)}
      >
        <View style={styles.alertOverlay}>
          <View style={styles.alertContainer}>
            <Text style={styles.alertTitle}>Validation Error</Text>
            <Text style={styles.alertMessage}>{alertMessage}</Text>
            <TouchableOpacity
              onPress={() => setAlertVisible(false)}
              style={styles.alertButton}
            >
              <Text style={styles.alertButtonText}>OK </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  closeTouchable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    height: hp("50%"),
    width: wp("95%"),
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: wp("4%"),
    alignItems: "center",
  },
  modalTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "bold",
    marginBottom: hp("2%"),
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: hp("1.2%"),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: hp("1.2%"),
    backgroundColor: "#fff",
  },
  friendsTitle: {
    fontSize: wp("4%"),
    fontWeight: "bold",
    marginBottom: hp("1%"),
    textAlign: "center",
  },
  friendsList: {
    width: "100%",
    marginBottom: hp("1%"),
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    padding: hp("1.2%"),
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: wp("1%"),
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  createButton: {
    backgroundColor: "#007BFF",
  },
  cancelButtonText: {
    color: "#000",
  },
  createButtonText: {
    color: "#fff",
  },
  alertOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  alertContainer: {
    width: wp("80%"),
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: wp("5%"),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  alertTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "bold",
    marginBottom: hp("1%"),
  },
  alertMessage: {
    fontSize: wp("4%"),
    textAlign: "center",
    marginBottom: hp("2%"),
  },
  alertButton: {
    marginTop: hp("2%"),
    backgroundColor: "#007BFF",
    borderRadius: 10,
    padding: hp("1.2%"),
    alignItems: "center",
    width: wp("50%"),
  },
  alertButtonText: {
    color: "#fff",
    fontSize: wp("4%"),
  },
});

export default CreateChatRoomModal;
