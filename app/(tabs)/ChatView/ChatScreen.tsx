import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchMessages, sendMessage, deleteMessage } from '@/controller/DatabaseHandler';
import { auth, db } from '@/controller/FirebaseHandler';
import TitleHeader from '@/components/TitleHeader';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "@/constants/Colors";
import { collection, onSnapshot, orderBy, query, getDoc, doc as firestoreDoc } from 'firebase/firestore';

type Message = {
  id: string;
  text: string;
  userId: string;
  timestamp: Date;
  userProfileImage: string;
};

type UserProfile = {
  profilePicture?: string;
};

const ChatScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { chatRoomId, chatRoomName } = route.params as { chatRoomId: string; chatRoomName: string };
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title: chatRoomName });
  }, [navigation, chatRoomName]);

  useEffect(() => {
    const messagesCollection = collection(db, "chatRooms", chatRoomId, "messages");
    const messagesQuery = query(messagesCollection, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(messagesQuery, async (querySnapshot) => {
      const msgs = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();
        const timestamp = data.timestamp ? data.timestamp.toDate() : new Date();
        const userDoc = await getDoc(firestoreDoc(db, "users", data.userId));
        const userProfile = userDoc.exists() ? (userDoc.data() as UserProfile) : {};
        const userProfileImage = userProfile.profilePicture || 'https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg';
        return { id: docSnapshot.id, text: data.text, userId: data.userId, timestamp, userProfileImage };
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatRoomId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      await sendMessage(chatRoomId, newMessage);
      setNewMessage('');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    await deleteMessage(chatRoomId, messageId);
  };

  const confirmDeleteMessage = (messageId: string) => {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => handleDeleteMessage(messageId),
          style: "destructive",
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isCurrentUser = item.userId === auth.currentUser?.uid;
    const formattedDate = new Date(item.timestamp).toLocaleString();

    return (
      <TouchableOpacity onPress={() => confirmDeleteMessage(item.id)}>
        <View style={styles.messageContainer}>
          <Text style={styles.timestampText}>{formattedDate}</Text>
          <View style={[styles.messageBubbleContainer, isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer]}>
            {!isCurrentUser && (
              <Image source={{ uri: item.userProfileImage }} style={styles.profileImage} />
            )}
            <View style={[styles.messageBubble, isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage]}>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TitleHeader title='Chat' />
      </View>
      <View style={styles.chatContainer}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.innerContainer}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.inner}>
              <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.messageList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
              />
              <MessageInput
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                handleSendMessage={handleSendMessage}
              />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const MessageInput: React.FC<{
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
}> = ({ newMessage, setNewMessage, handleSendMessage }) => {
  return (
    <View style={styles.inputContainer}>
      <Image
        source={require('../../../assets/images/Buddy toggle.png')}
        style={styles.image}
      />
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        value={newMessage}
        onChangeText={setNewMessage}
      />
      <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
        <FontAwesome
          name="send"
          size={24}
          color={Colors.light.iconColor}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 120,
    backgroundColor: '#fff',
  },
  chatContainer: {
    flex: 1,
    marginTop: 10,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  inner: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  messageList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  messageContainer: {
    marginVertical: 5,
  },
  messageBubbleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentUserContainer: {
    justifyContent: 'flex-end',
  },
  otherUserContainer: {
    justifyContent: 'flex-start',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageBubble: {
    borderRadius: 20,
    padding: 10,
    maxWidth: '80%',
  },
  currentUserMessage: {
    backgroundColor: '#007BFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  otherUserMessage: {
    backgroundColor: 'purple',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  timestampText: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'center',
    marginBottom: 2,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: "#f2f2f2",
  },
  sendButton: {
    marginLeft: 10,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});

export default ChatScreen;
