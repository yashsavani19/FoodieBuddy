import React, { useState, useEffect, useRef } from "react";
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
  Modal,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { sendMessage, deleteMessage, fetchAllUsernames } from "@/controller/DatabaseHandler";
import { auth, db } from "@/controller/FirebaseHandler";
import TitleHeader from "@/components/TitleHeader";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { collection, onSnapshot, orderBy, query, DocumentData } from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from '@expo/vector-icons';

interface Message {
  id: string;
  text: string;
  userId: string;
  timestamp: Date;
  userProfileImage: string;
  username: string;
}

interface RouteParams {
  chatRoomId: string;
  chatRoomName: string;
}

const ChatScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { chatRoomId, chatRoomName } = route.params as RouteParams;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [settingsVisible, setSettingsVisible] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUsernames = async () => {
      const usernames = await fetchAllUsernames();
      console.log("Fetched Usernames:", usernames);
      return usernames;
    };

    const fetchMessagesAndSubscribe = async () => {
      console.log("Fetching messages...");
      const usernames = await fetchUsernames();
      const messagesCollection = collection(db, "chatRooms", chatRoomId, "messages");
      const messagesQuery = query(messagesCollection, orderBy("timestamp", "asc"));

      const unsubscribe = onSnapshot(messagesQuery, async (querySnapshot) => {
        console.log("Snapshot received");
        const msgs = await Promise.all(
          querySnapshot.docs.map(async (docSnapshot) => {
            const data = docSnapshot.data() as DocumentData;
            const timestamp = data.timestamp ? data.timestamp.toDate() : new Date();
            const usernameData = usernames[data.userId] || { username: "Unknown User", profileImageUrl: "" };
            return {
              id: docSnapshot.id,
              text: data.text,
              userId: data.userId,
              timestamp,
              userProfileImage: usernameData.profileImageUrl,
              username: usernameData.username,
            };
          })
        );

        if (isMounted) {
          console.log("Updating messages...");
          setMessages(msgs);
          flatListRef.current?.scrollToEnd({ animated: true });
        }
      });

      return () => {
        isMounted = false;
        console.log("Unsubscribing from snapshot");
        unsubscribe();
      };
    };

    fetchMessagesAndSubscribe();
    return () => {
      isMounted = false;
    };
  }, [chatRoomId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      await sendMessage(chatRoomId, newMessage);
      setNewMessage("");
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
          <View
            style={[
              styles.messageBubbleContainer,
              isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer,
            ]}
          >
            {!isCurrentUser && (
              <View style={styles.otherUserHeader}>
                <View style={styles.profileImageContainer}>
                  <Text style={styles.usernameText} numberOfLines={1} ellipsizeMode="tail">
                    {item.username}
                  </Text>
                  <Image source={{ uri: item.userProfileImage }} style={styles.profileImage} />
                </View>
                <View style={[styles.messageBubble, styles.otherUserMessage]}>
                  <Text style={styles.otherUserMessageText}>{item.text}</Text>
                </View>
              </View>
            )}
            {isCurrentUser && (
              <View style={[styles.messageBubble, styles.currentUserMessage]}>
                <Text style={styles.messageText}>{item.text}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const openSettings = () => {
    setSettingsVisible(true);
  };

  const closeSettings = () => {
    setSettingsVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TitleHeader title="Chat" />
        <View style={styles.navigationBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navButton}>
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={openSettings} style={styles.navButton}>
            <MaterialIcons name="settings" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inputContainer}>
            <Image source={require('../../../assets/images/Buddy toggle.png')} style={styles.image} />
            <TextInput
              style={styles.input}
              placeholder="Type a message"
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
              <FontAwesome name="send" size={24} color="#f76116" />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsVisible}
        onRequestClose={closeSettings}
      >
        <TouchableWithoutFeedback onPress={closeSettings}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Settings</Text>
              <TouchableOpacity onPress={() => { /* Handle Profile navigation */ }} style={styles.modalItem}>
                <Text style={styles.modalItemText}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { /* Handle Notifications navigation */ }} style={styles.modalItem}>
                <Text style={styles.modalItemText}>Notifications</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { /* Handle Logout */ }} style={styles.modalItem}>
                <Text style={styles.modalItemText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 120,
    backgroundColor: "#fff",
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#000',
    width: '100%',
    height: 40,
  },
  navButton: {
    padding: 5,
  },
  messageContainer: {
    marginVertical: 5,
  },
  messageBubbleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentUserContainer: {
    justifyContent: "flex-end",
  },
  otherUserContainer: {
    justifyContent: "flex-start",
  },
  otherUserHeader: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "80%",
  },
  profileImageContainer: {
    alignItems: "center",
    marginRight: 10,
    width: 70,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  messageBubble: {
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  currentUserMessage: {
    backgroundColor: "#f76116",
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
    marginRight: 10,
  },
  otherUserMessage: {
    backgroundColor: "#d3d3d3",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: '500'
  },
  otherUserMessageText: {
    fontSize: 16,
    color: "#000",
    fontWeight: '500'
  },
  timestampText: {
    fontSize: 12,
    color: "#888",
    alignSelf: "center",
    marginBottom: 2,
  },
  usernameText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 2,
    marginLeft: 5,
    textAlign: 'center',
    width: '100%',
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
    width: 40,
    height: 40,
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  modalItem: {
    padding: 10,
    width: "100%",
  },
  modalItemText: {
    fontSize: 18,
  },
});

export default ChatScreen;
