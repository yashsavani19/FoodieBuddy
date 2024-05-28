/**
 * ChatRoomItem.tsx
 * 
 * This file defines the ChatRoomItem component, which is responsible for rendering individual chat rooms in the chat list.
 * The component includes an avatar, chat room name, last message, and a delete icon for removing the chat room.
 * The chat room can be of type "buddy" or "friends", and the navigation destination differs based on the type.
 * 
 * Props:
 * - chatRoom: An object containing the chat room's id, name, lastMessage, avatar, and timestamp.
 * - onDelete: A function to handle the deletion of a chat room.
 * - type: A string indicating the type of chat room ("buddy" or "friends").
 * 
 * The component uses React Navigation for navigating to the appropriate chat screen when a chat room is pressed.
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/navigationTypes";
import { MaterialIcons } from "@expo/vector-icons";

type ChatRoom = {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
  timestamp: Date;
};

type ChatRoomItemProps = {
  chatRoom: ChatRoom;
  onDelete: (id: string) => void;
  type: string;
};

const ChatRoomItem: React.FC<ChatRoomItemProps> = ({ chatRoom, onDelete, type }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handlePress = () => {
    if (type === "buddy") {
      navigation.navigate("BuddyChat", { chatRoomId: chatRoom.id });
    } else {
      navigation.navigate("ChatScreen", { chatRoomId: chatRoom.id });
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Chat Room",
      `Are you sure you want to delete the chat room "${chatRoom.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => onDelete(chatRoom.id),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.chatRoomContainer}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: chatRoom.avatar || "https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg",
            }}
            style={styles.avatar}
          />
        </View>
        <View style={styles.chatRoomInfo}>
          <Text style={styles.chatRoomName}>{chatRoom.name}</Text>
          <View style={styles.timestampContainer}>
            <Text style={styles.chatRoomLastMessage}>{chatRoom.lastMessage}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={confirmDelete} style={styles.deleteButton}>
          <MaterialIcons name="remove" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatRoomContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    backgroundColor: "#ffffff",
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
  },
  chatRoomInfo: {
    justifyContent: "center",
    flex: 1,
  },
  chatRoomName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000000",
  },
  chatRoomLastMessage: {
    color: "#888",
  },
  deleteButton: {
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  timestampContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
  },
});

export default ChatRoomItem;
