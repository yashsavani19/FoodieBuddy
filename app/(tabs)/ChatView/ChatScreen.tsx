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
  Dimensions,
} from "react-native";
import { useRoute, useNavigation, NavigationProp } from "@react-navigation/native";
import {
  sendMessage,
  deleteMessage,
  fetchAllUsernames,
  updateTypingStatus,
  listenToTypingStatus,
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
import TypingIndicator from "@/components/TypingIndicator";
import { RootStackParamList } from "@/constants/navigationTypes";

const { width, height } = Dimensions.get('window');

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
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [typingUsers, setTypingUsers] = useState<{ [key: string]: { isTyping: boolean, username: string } }>({});
  const flatListRef = useRef<FlatList<Message>>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    const unsubscribeTypingStatus = listenToTypingStatus(chatRoomId, (typingUsers) => {
      setTypingUsers(typingUsers);
    });

    return () => {
      isMounted = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      unsubscribeTypingStatus();
    };
  }, [chatRoomId]);

  const handleSendMessage = useCallback(async () => {
    if (newMessage.trim()) {
      try {
        await sendMessage(chatRoomId, newMessage);
        setNewMessage("");
        await updateTypingStatus(chatRoomId, auth.currentUser?.uid || "", auth.currentUser?.displayName || "Unknown User", false);
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

  const handleProfilePress = (friend: { profileImageUrl: string; username: string; uid: string }) => {
    navigation.navigate("FriendProfile", { friend });
  };

  const handleTyping = (text: string) => {
    setNewMessage(text);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    updateTypingStatus(chatRoomId, auth.currentUser?.uid || "", auth.currentUser?.displayName || "Unknown User", true);
    typingTimeoutRef.current = setTimeout(() => {
      updateTypingStatus(chatRoomId, auth.currentUser?.uid || "", auth.currentUser?.displayName || "Unknown User", false);
    }, 3000);
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
                <TouchableOpacity onPress={() => handleProfilePress({ profileImageUrl: item.userProfileImage, username: item.username, uid: item.userId })}>
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
                </TouchableOpacity>
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
      <View style={styles.contentContainer}>
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
        <TypingIndicator typingUsers={typingUsers} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
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
              onChangeText={handleTyping}
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              style={styles.sendButton}
            >
              <FontAwesome name="send" size={width * 0.06} color="#f76116" />
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
    paddingTop: 120,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1,
  },
  flatListContentContainer: {
    paddingBottom: height * 0.1, 
  },
  messageContainer: {
    marginVertical: height * 0.01,
    paddingHorizontal: width * 0.02,
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
    maxWidth: width * 0.8,
  },
  profileImageContainer: {
    alignItems: "center",
    marginRight: width * 0.03,
    width: width * 0.18,
  },
  profileImage: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: (width * 0.1) / 2,
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
    padding: width * 0.03,
    maxWidth: width * 0.9,
  },
  currentUserMessage: {
    backgroundColor: "#f76116",
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
    marginRight: width * 0.02,
    marginLeft: width * 0.05,
  },
  otherUserMessage: {
    backgroundColor: "#d3d3d3",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
    marginRight: width * 0.05,
  },
  messageText: {
    fontSize: width * 0.04,
    color: "#fff",
    fontWeight: "500",
  },
  otherUserMessageText: {
    fontSize: width * 0.04,
    color: "#000",
    fontWeight: "500",
  },
  timestampText: {
    fontSize: width * 0.03,
    color: "#888",
    alignSelf: "center",
    marginBottom: height * 0.002,
  },
  usernameText: {
    fontSize: width * 0.03,
    fontWeight: "bold",
    color: "#555",
    marginBottom: height * 0.002,
    marginLeft: width * 0.01,
    textAlign: "center",
    width: width,
  },
  inputContainer: {
    flexDirection: "row",
    padding: width * 0.03,
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderColor: "#e2e2e2",
    width: width * 0.95,
    alignSelf: "center",
    borderRadius: width * 0.06,
    height: 60
  },
  input: {
    flex: 1,
    fontSize: width * 0.04,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: width * 0.06,
    paddingHorizontal: width * 0.03,
    backgroundColor: "#fff",
    height: 40, 
  },
  sendButton: {
    marginLeft: width * 0.03,
  },
  image: {
    width: width * 0.1,
    height: width * 0.1,
    marginRight: width * 0.03,
  },
});

export default ChatScreen;
