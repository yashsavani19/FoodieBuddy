/**
 * CreateChatRoomModal.tsx
 * 
 * This file defines the CreateChatRoomModal component, which is a modal used for creating new chat rooms.
 * The modal includes a form for entering the chat room name and an optional image URL.
 * 
 * Props:
 * - visible: A boolean indicating whether the modal is visible.
 * - onClose: A function that is called when the modal is requested to be closed.
 * - onCreate: A function that is called to create a new chat room.
 * - newChatRoomName: The state variable for the new chat room name.
 * - setNewChatRoomName: The state setter for the new chat room name.
 * - newChatRoomImageUrl: The state variable for the new chat room image URL.
 * - setNewChatRoomImageUrl: The state setter for the new chat room image URL.
 */

import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

interface CreateChatRoomModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: () => void;
  newChatRoomName: string;
  setNewChatRoomName: (name: string) => void;
  newChatRoomImageUrl: string;
  setNewChatRoomImageUrl: (url: string) => void;
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
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalView}
      >
        <Text style={styles.modalText}>Create New Chat Room</Text>
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
        <View style={styles.buttonContainer}>
          <Button title="Create" onPress={onCreate} />
          <Button
            title="Cancel"
            onPress={onClose}
            color="#ff6f00"
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 20,
  },
  modalText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
});

export default CreateChatRoomModal;
