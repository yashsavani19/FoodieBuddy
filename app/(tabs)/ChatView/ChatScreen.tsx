import React, { useState, useEffect, useRef, useCallback } from "react";
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
} from "react-native";
import { useRoute } from "@react-navigation/native";
import {
  sendMessage,
  deleteMessage,
  fetchAllUsernames,
} from "@/controller/DatabaseHandler";
import { auth, db } from "@/controller/FirebaseHandler";
import TitleHeader from "@/components/TitleHeader";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  DocumentData,
} from "firebase/firestore";
import NavBar from "@/components/NavBar";
import SettingsModal from "@/components/SettingsModal";

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
  const { chatRoomId, chatRoomName } = route.params as RouteParams;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [settingsVisible, setSettingsVisible] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUsernames = async () => {
      try {
        const usernames = await fetchAllUsernames();
        console.log("Fetched Usernames:", usernames);
        return usernames;
      } catch (error) {
        console.error("Error fetching usernames:", error);
        return {};
      }
    };

    const fetchMessagesAndSubscribe = async () => {
      console.log("Fetching messages...");
      const usernames = await fetchUsernames();
      const messagesCollection = collection(
        db,
        "chatRooms",
        chatRoomId,
        "messages"
      );
      const messagesQuery = query(
        messagesCollection,
        orderBy("timestamp", "asc")
      );

      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

      const unsubscribe = onSnapshot(messagesQuery, async (querySnapshot) => {
        console.log("Snapshot received");
        const msgs = await Promise.all(
          querySnapshot.docs.map(async (docSnapshot) => {
            const data = docSnapshot.data() as DocumentData;
            const timestamp = data.timestamp
              ? data.timestamp.toDate()
              : new Date();
            const usernameData = usernames[data.userId] || {
              username: "Unknown User",
              profileImageUrl: "",
            };
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

      unsubscribeRef.current = unsubscribe;
    };

    fetchMessagesAndSubscribe();

    return () => {
      isMounted = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [chatRoomId]);

  const handleSendMessage = useCallback(async () => {
    if (newMessage.trim()) {
      try {
        await sendMessage(chatRoomId, newMessage);
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  }, [newMessage, chatRoomId]);

  const handleDeleteMessage = useCallback(
    async (messageId: string) => {
      try {
        await deleteMessage(chatRoomId, messageId);
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    },
    [chatRoomId]
  );

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
              isCurrentUser
                ? styles.currentUserContainer
                : styles.otherUserContainer,
            ]}
          >
            {!isCurrentUser && (
              <View style={styles.otherUserHeader}>
                <View style={styles.profileImageContainer}>
                  <Text
                    style={styles.usernameText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.username}
                  </Text>
                  <Image
                    source={{ uri: item.userProfileImage }}
                    style={styles.profileImage}
                  />
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
        <TitleHeader title="Friends Chat" />
        <NavBar openSettings={openSettings} />
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContentContainer} 
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 20 })}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inputContainer}>
            <Image
              source={require("../../../assets/images/Buddy toggle.png")}
              style={styles.image}
            />
            <TextInput
              style={styles.input}
              placeholder="Type a message"
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              style={styles.sendButton}
            >
              <FontAwesome name="send" size={24} color="#f76116" />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <SettingsModal visible={settingsVisible} onClose={closeSettings} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 60 : 80, 
    backgroundColor: "#fff",
  },
  flatListContentContainer: {
    paddingBottom: 70, 
  },
  messageContainer: {
    marginVertical: 5,
    paddingHorizontal: 10,
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
    maxWidth: '90%', 
  },
  currentUserMessage: {
    backgroundColor: "#f76116",
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
    marginRight: 10,
    marginLeft: 20, 
  },
  otherUserMessage: {
    backgroundColor: "#d3d3d3",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
    marginRight: 20, 
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  otherUserMessageText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
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
    textAlign: "center",
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderColor: "#e2e2e2",
  },
  input: {
    flex: 1,
    fontSize: 14,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: "#f2f2f2",
    height: 30,
  },
  sendButton: {
    marginLeft: 10,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
});

export default ChatScreen;
