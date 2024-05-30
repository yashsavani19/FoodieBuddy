import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Text,
} from "react-native";
import {
  fetchChatRooms,
  createChatRoom,
  deleteChatRoom,
  subscribeToFriends,
} from "@/controller/DatabaseHandler";
import { auth } from "@/controller/FirebaseHandler";
import ChatRoomItem from "./ChatRoomItem";
import CreateChatRoomModal from "./CreateChatRoomModal";
import { Friend as FriendModel } from "@/model/Friend";

type ChatRoom = {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
  timestamp: Date;
};

type Friend = {
  id: string;
  name: string;
  avatar: string | number;
  isAdded: boolean;
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
  const [friends, setFriends] = useState<Friend[]>([]);

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
      console.log("ChatRooms fetched: ", formattedRooms); 
    } catch (error) {
      console.error("Error fetching chat rooms: ", error);
    }
  };

  useEffect(() => {
    getChatRooms();

    const unsubscribe = subscribeToFriends((friendsList) => {
      const formattedFriends = friendsList.map((friend: FriendModel) => ({
        id: friend.uid,
        name: friend.username,
        avatar: friend.profileImageUrl || "",
        isAdded: false,
      }));
      setFriends(formattedFriends);
    });

    return () => {
      unsubscribe();
    };
  }, [type]);

  const handleCreateChatRoom = async () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      // Get the IDs of the friends who are added to the chat room
      const allowedUsers = friends.filter(friend => friend.isAdded).map(friend => friend.id);
      // Include the current user's ID
      allowedUsers.push(userId);
      console.log("Allowed Users on Create:", allowedUsers); 

      if (allowedUsers.length === 0) {
        console.error("No friends added to the chat room.");
        return;
      }

      await createChatRoom(
        newChatRoomName,
        type,
        newChatRoomImageUrl || "https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg",
        allowedUsers
      );
      console.log("Chat room created, calling getChatRooms");
      await getChatRooms();
      setNewChatRoomName("");
      setNewChatRoomImageUrl("");
      setModalVisible(false);
    } else {
      console.error("No user is signed in.");
    }
  };

  const handleDeleteChatRoom = async (id: string) => {
    await deleteChatRoom(id);
    await getChatRooms();
  };

  const onRefresh = () => {
    setRefreshing(true);
    getChatRooms().then(() => setRefreshing(false));
  };

  const toggleFriendAdded = (id: string) => {
    setFriends((prevFriends) => {
      const updatedFriends = prevFriends.map((friend) =>
        friend.id === id ? { ...friend, isAdded: !friend.isAdded } : friend
      );
      console.log("Toggle Added: ",updatedFriends);
      return updatedFriends;
    });
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>New Chat</Text>
      </TouchableOpacity>
      <CreateChatRoomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreateChatRoom}
        newChatRoomName={newChatRoomName}
        setNewChatRoomName={setNewChatRoomName}
        newChatRoomImageUrl={newChatRoomImageUrl}
        setNewChatRoomImageUrl={setNewChatRoomImageUrl}
        friends={friends}
        toggleFriendAdded={toggleFriendAdded}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2E2E2E",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007BFF",
    borderRadius: 15,
    padding: 10,
    width: 120,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ChatList;
