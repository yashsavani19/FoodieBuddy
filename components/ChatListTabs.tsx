import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Modal, TextInput, Button, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { fetchChatRooms, createChatRoom, deleteChatRoom } from '@/controller/DatabaseHandler';
import { auth } from '@/controller/FirebaseHandler'; // Import auth object

type ChatRoom = {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
};

const Tab = createMaterialTopTabNavigator();

const ChatRoomItem: React.FC<{ chatRoom: ChatRoom, onDelete: (id: string) => void }> = ({ chatRoom, onDelete }) => (
  <View style={styles.chatRoomContainer}>
    <View style={styles.avatarContainer}>
      <Image
        source={{ uri: chatRoom.avatar || 'https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg' }} // Provide a default avatar
        style={styles.avatar}
      />
    </View>
    <View style={styles.chatRoomInfo}>
      <Text style={styles.chatRoomName}>{chatRoom.name}</Text>
      <Text style={styles.chatRoomLastMessage}>{chatRoom.lastMessage}</Text>
    </View>
    <TouchableOpacity onPress={() => onDelete(chatRoom.id)} style={styles.deleteButton}>
      <Text style={styles.deleteButtonText}>Remove</Text>
    </TouchableOpacity>
  </View>
);

const ChatList: React.FC<{ type: string }> = ({ type }) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newChatRoomName, setNewChatRoomName] = useState('');
  const [newChatRoomImageUrl, setNewChatRoomImageUrl] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const getChatRooms = async () => {
    const rooms = await fetchChatRooms(); // Fetch chat rooms based on type if needed
    rooms.sort((a, b) => a.name.localeCompare(b.name)); // Sort chat rooms alphabetically
    setChatRooms(rooms);
  };

  useEffect(() => {
    getChatRooms();
  }, [type]);

  const handleCreateChatRoom = async () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      await createChatRoom(newChatRoomName, newChatRoomImageUrl || 'https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg');
      setModalVisible(false);
      setNewChatRoomName('');
      setNewChatRoomImageUrl('');
      await getChatRooms(); // Refresh chat rooms list to include the new chat room
    } else {
      console.error('User is not authenticated');
    }
  };

  const handleDeleteChatRoom = async (id: string) => {
    await deleteChatRoom(id);
    await getChatRooms(); // Refresh chat rooms list after deletion
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getChatRooms();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chatRooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatRoomItem chatRoom={item} onDelete={handleDeleteChatRoom} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity style={styles.newChatButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.newChatButtonText}>New Chat</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalView}>
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
            keyboardType="url" // Specific keyboard type for URL input
            autoCapitalize="none" // Prevent automatic capitalization
            autoCorrect={false} // Disable autocorrect
          />
          <View style={styles.buttonContainer}>
            <Button title="Create" onPress={handleCreateChatRoom} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="#ff6f00" />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const BuddyChatBot = () => <ChatList type="buddy" />;
const FriendsChat = () => <ChatList type="friends" />;

const ChatListTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: '#1e1e1e' }, // Tab bar background color
        tabBarIndicatorStyle: { 
          backgroundColor: '#ff6f00', // Tab indicator color
          width: '30%', // Indicator width
          borderRadius: 5, // Rounded corners
          height: 3, // Indicator height
          alignSelf: 'center', // Center the indicator within each tab
          marginLeft: 38.5, // Ensure the indicator is centered within each tab
        },
        tabBarLabelStyle: { 
          color: '#ffffff', // Tab label color
          fontWeight: 'bold', // Make the label text bold
          textTransform: 'none', // Prevent text from being all uppercase
          fontSize: 18,
        },
      }}
    >
      <Tab.Screen name="Buddy ChatBot" component={BuddyChatBot} />
      <Tab.Screen name="Friends Chat" component={FriendsChat} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E2E2E', // Background color for chat list
  },
  chatRoomContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333', // Adjusted to match dark theme
    backgroundColor: '#ffffff', // Set background color to white for chat rooms
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  chatRoomInfo: {
    justifyContent: 'center',
    flex: 1,
  },
  chatRoomName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000', // Text color for white background
  },
  chatRoomLastMessage: {
    color: '#888',
  },
  deleteButton: {
    backgroundColor: '#ff6f00',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  newChatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007BFF',
    borderRadius: 15,
    padding: 10,
    width: 120,
  },
  newChatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalView: {
    margin: 20,
    backgroundColor: '#3E3E3E',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default ChatListTabs;
