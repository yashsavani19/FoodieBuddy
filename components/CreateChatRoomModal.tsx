import React from "react";
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
  Dimensions,
} from "react-native";
import FriendItem from "./FriendChatItem";

interface Friend {
  id: string;
  name: string;
  avatar: string | number;
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
  friends,
  toggleFriendAdded,
}) => {
  const sortedFriends = friends.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalOverlay}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={onClose}
          activeOpacity={1}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalContent}
              activeOpacity={1}
            >
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
                renderItem={({ item }) => (
                  <FriendItem friend={item} toggleFriendAdded={toggleFriendAdded} />
                )}
                keyExtractor={(item) => item.id}
                style={styles.friendsList}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={onClose}
                  style={[styles.button, styles.cancelButton]}
                >
                  <Text style={styles.cancelButtonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onCreate}
                  style={[styles.button, styles.createButton]}
                >
                  <Text style={styles.createButtonText}>Create Chat</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
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
    width: '90%',
    maxHeight: '80%',
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContent: {
    width: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
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
    flexGrow: 0,
    maxHeight: Dimensions.get('window').height * 0.4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 10,
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
