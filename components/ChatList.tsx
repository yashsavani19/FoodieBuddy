/**
 * ChatList.tsx
 * 
 * This file defines the ChatList component, which displays a list of chat rooms. The component supports fetching,
 * creating, and deleting chat rooms from a database, and it utilizes Firebase for user authentication and database
 * operations.
 * 
 * Props:
 * - type: A string indicating the type of chat rooms to display ("buddy" or "friends").
 * 
 * The component includes:
 * - A state for managing chat rooms, modal visibility, new chat room name, image URL, and refresh status.
 * - A useEffect hook to fetch chat rooms when the component mounts or when the type prop changes.
 * - Functions for handling the creation and deletion of chat rooms.
 * - A modal for creating new chat rooms, with a form for entering the chat room name and image URL.
 * - A FlatList for rendering the list of chat rooms with pull-to-refresh functionality.
 * - A button for opening the modal to create new chat rooms.
 */

import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  Text,
} from "react-native";
import { fetchChatRooms, createChatRoom, deleteChatRoom } from "@/controller/DatabaseHandler";
import { auth } from "@/controller/FirebaseHandler";
import ChatRoomItem from "./ChatRoomItem";

type ChatRoom = {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
  timestamp: Date;
};

type ChatListProps = {
  type: string;
};

const ChatList: React.FC<ChatListProps> = ({ type }) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newChatRoomName, setNewChatRoomName] = useState("");
  const [newChatRoomImageUrl, setNewChatRoomImageUrl] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const getChatRooms = async () => {
    try {
      const rooms = await fetchChatRooms(type);
      const formattedRooms: ChatRoom[] = rooms.map((room) => ({
        id: room.id,
        name: room.name,
        lastMessage: room.lastMessage,
        avatar: room.avatar,
        timestamp: room.lastMessageTimestamp,
      }));
      formattedRooms.sort((a, b) => a.name.localeCompare(b.name));
      setChatRooms(formattedRooms);
    } catch (error) {
      console.error("Error fetching chat rooms: ", error);
    }
  };

  useEffect(() => {
    getChatRooms();
  }, [type]);

  const handleCreateChatRoom = async () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      await createChatRoom(
        newChatRoomName,
        type,
        newChatRoomImageUrl || "https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"
      );
      getChatRooms();
      setNewChatRoomName("");
      setNewChatRoomImageUrl("");
      setModalVisible(false);
    } else {
      console.error("No user is signed in.");
    }
  };

  const handleDeleteChatRoom = async (id: string) => {
    await deleteChatRoom(id);
    getChatRooms();
  };

  const onRefresh = () => {
    setRefreshing(true);
    getChatRooms().then(() => setRefreshing(false));
  };

  const renderItem = ({ item }: { item: ChatRoom }) => (
    <ChatRoomItem chatRoom={item} onDelete={handleDeleteChatRoom} type={type} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatRooms}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
        <Text style={styles.addButtonText}>Create New Chat Room</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Create Chat Room</Text>
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
          />
          <Button title="Create" onPress={handleCreateChatRoom} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  addButton: {
    backgroundColor: "#ff6f00",
    padding: 15,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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

export default ChatList;
