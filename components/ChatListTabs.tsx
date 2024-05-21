import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Modal, 
  TextInput, 
  Button, 
  KeyboardAvoidingView, 
  Platform, 
  RefreshControl 
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { fetchChatRooms, createChatRoom, deleteChatRoom } from '@/controller/DatabaseHandler';
import { auth } from '@/controller/FirebaseHandler';

type ChatRoom = {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
};

const Tab = createMaterialTopTabNavigator();

type ChatRoomItemProps = {
  chatRoom: ChatRoom;
  onDelete: (id: string) => void;
};

const ChatRoomItem: React.FC<ChatRoomItemProps> = ({ chatRoom, onDelete }) => (
  <View style={styles.chatRoomContainer}>
    <View style={styles.avatarContainer}>
      <Image
        source={{ uri: chatRoom.avatar || 'https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg' }}
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

type ChatListProps = {
  type: string;
};

const ChatList: React.FC<ChatListProps> = ({ type }) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newChatRoomName, setNewChatRoomName] = useState('');
  const [newChatRoomImageUrl, setNewChatRoomImageUrl] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const getChatRooms = async () => {
    const rooms = await fetchChatRooms(type);
    rooms.sort((a, b) => a.name.localeCompare(b.name));
    setChatRooms(rooms);
  };

  useEffect(() => {
    getChatRooms();
  }, [type]);

  const handleCreateChatRoom = async () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      await createChatRoom(newChatRoomName, type, newChatRoomImageUrl || 'https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg');
      setModalVisible(false);
      setNewChatRoomName('');
      setNewChatRoomImageUrl('');
      await getChatRooms();
    } else {
      console.error('User is not authenticated');
    }
  };

  const handleDeleteChatRoom = async (id: string) => {
    await deleteChatRoom(id);
    await getChatRooms();
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
        onRequestClose={() => setModalVisible(!modalVisible)}
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
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
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

const BuddyChatBot: React.FC = () => <ChatList type="buddy" />;
const FriendsChat: React.FC = () => <ChatList type="friends" />;

const ChatListTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: { backgroundColor: '#1e1e1e' },
      tabBarIndicatorStyle: { 
        backgroundColor: '#ff6f00',
        width: '30%',
        borderRadius: 5,
        height: 5,
        alignSelf: 'center',
        marginLeft: 38.5,
      },
      tabBarLabelStyle: { 
        color: '#ffffff',
        fontWeight: 'bold',
        textTransform: 'none',
        fontSize: 18,
      },
    }}
  >
    <Tab.Screen name="Buddy ChatBot" component={BuddyChatBot} />
    <Tab.Screen name="Friends Chat" component={FriendsChat} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E2E2E',
  },
  chatRoomContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#ffffff',
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
    color: '#000000',
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
    textAlign: 'center',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default ChatListTabs;
