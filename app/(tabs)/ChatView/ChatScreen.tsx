import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
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
import {
  useRoute,
  useNavigation,
  NavigationProp,
  TabRouter,
} from "@react-navigation/native";
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
import { useOpenAIHandler } from "@/controller/OpenAIHandler";
import Constants from "expo-constants";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { DefaultStyle } from "react-native-reanimated/lib/typescript/reanimated2/hook/commonTypes";
import { ImageSourcePropType } from "react-native";
import { Message } from "@/model/Message";
import { GroupChatDefaultSystemPrompt } from "@/model/DefaultGroupChatAISystemPrompt";
import { AppContext } from "@/context/AppContext";

const { width, height } = Dimensions.get("window");

interface RouteParams {
  chatRoomId: string;
  chatRoomName: string;
}

interface AnimatedImageProps {
  source: ImageSourcePropType;
}

const ChatScreen: React.FC = () => {
  const route = useRoute();
  const { localRestaurants } = useContext(AppContext);
  const { chatRoomId, chatRoomName } = route.params as RouteParams;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { sendMessage: sendAIMessage, setSystemPrompt } = useOpenAIHandler();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [typingUsers, setTypingUsers] = useState<{
    [key: string]: { isTyping: boolean; username: string };
  }>({});
  const [isBuddyOn, setIsBuddyOn] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const buddyProfileImage = require("../../../assets/images/buddy-toggle-on.png");

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
              username: data.userId === "buddy" ? "Buddy" : "Unknown User",
              profileImageUrl: data.userId === "buddy" ? buddyProfileImage : "",
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

    const unsubscribeTypingStatus = listenToTypingStatus(
      chatRoomId,
      (typingUsers) => {
        setTypingUsers(typingUsers);
      }
    );

    return () => {
      isMounted = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      unsubscribeTypingStatus();
    };
  }, [chatRoomId]);

  // Saturation animation style

  const handleSendMessage = useCallback(async () => {
    if (newMessage.trim()) {
      try {
        const messageId = Date.now().toString();
        const userMessage: Message = {
          id: messageId,
          text: newMessage,
          userId: auth.currentUser?.uid || "unknown",
          timestamp: new Date(),
          userProfileImage: auth.currentUser?.photoURL || "",
          username: auth.currentUser?.displayName || "You",
        };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        flatListRef.current?.scrollToEnd({ animated: true });

        await sendMessage(chatRoomId, newMessage);
        setNewMessage("");
        await updateTypingStatus(
          chatRoomId,
          auth.currentUser?.uid || "",
          auth.currentUser?.displayName || "Unknown User",
          false
        );
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  }, [newMessage, chatRoomId, isBuddyOn, sendAIMessage]);

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

  const handleProfilePress = (friend: {
    profileImageUrl: string | number;
    username: string;
    uid: string;
  }) => {
    if (friend.uid !== "buddy") {
      navigation.navigate("FriendProfile", { friend });
    }
  };

  const handleTyping = (text: string) => {
    setNewMessage(text);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    updateTypingStatus(
      chatRoomId,
      auth.currentUser?.uid || "",
      auth.currentUser?.displayName || "Unknown User",
      true
    );
    typingTimeoutRef.current = setTimeout(() => {
      updateTypingStatus(
        chatRoomId,
        auth.currentUser?.uid || "",
        auth.currentUser?.displayName || "Unknown User",
        false
      );
    }, 3000);
  };

  const handleBuddyPress = async () => {
    // Set system prompt for group chat
    const systemPrompt = GroupChatDefaultSystemPrompt(localRestaurants, []);
    setSystemPrompt(systemPrompt);

    // compile recent messages and send to AI
    let recentMessages: string = messages
      .map((msg) => {
        return msg.userId !== "Buddy" ? msg.username + ": " + msg.text : null;
      })
      .join("\n");
      
    console.log("Recent Messages:", recentMessages);
    const aiResponse = await sendAIMessage(recentMessages);
    const buddyMessageId = Date.now().toString() + "ai";
    const buddyMessage: Message = {
      id: buddyMessageId,
      text: aiResponse,
      userId: "buddy",
      timestamp: new Date(),
      userProfileImage: buddyProfileImage,
      username: "Buddy",
    };

    setMessages((prevMessages) => {
      if (!prevMessages.find((msg) => msg.id === buddyMessageId)) {
        return [...prevMessages, buddyMessage];
      }
      return prevMessages;
    });

    await sendMessage(chatRoomId, buddyMessage.text, "buddy");

    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const handleBuddyToggle = async () => {
    setIsBuddyOn(!isBuddyOn);
    if (!isBuddyOn) {
      const buddyIntroMessage: Message = {
        id: Date.now().toString(),
        text: "Hi there! I'm Buddy, your AI assistant. How can I help you today?",
        userId: "buddy",
        timestamp: new Date(),
        userProfileImage: buddyProfileImage,
        username: "Buddy",
      };

      setMessages((prevMessages) => {
        if (!prevMessages.find((msg) => msg.id === buddyIntroMessage.id)) {
          return [...prevMessages, buddyIntroMessage];
        }
        return prevMessages;
      });

      await sendMessage(chatRoomId, buddyIntroMessage.text, "buddy");
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isCurrentUser = item.userId === auth.currentUser?.uid;
    const formattedDate = new Date(item.timestamp).toLocaleString();

    const profileImageUri =
      item.userProfileImage ||
      "https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg";

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
                <TouchableOpacity
                  onPress={() =>
                    handleProfilePress({
                      profileImageUrl: profileImageUri,
                      username: item.username,
                      uid: item.userId,
                    })
                  }
                >
                  <View style={styles.profileImageContainer}>
                    <Text
                      style={styles.usernameText}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.username}
                    </Text>
                    <Image
                      source={
                        typeof profileImageUri === "string"
                          ? { uri: profileImageUri }
                          : profileImageUri
                      }
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
            <TouchableOpacity onPress={handleBuddyPress}>
              <Image
                source={require("../../../assets/images/buddy-toggle-on.png")}
                style={styles.image}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
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
    paddingTop: Constants.statusBarHeight + 100,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  flatListContentContainer: {
    paddingBottom: 100,
  },
  messageContainer: {
    marginVertical: 10,
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
  animatedView: {},
  otherUserHeader: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: 320,
  },
  profileImageContainer: {
    alignItems: "center",
    marginRight: 12,
    width: 60,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  messageBubble: {
    borderRadius: 20,
    padding: 10,
    maxWidth: 320,
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
    marginRight: 30,
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
    textAlign: "center",
    width: width,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderColor: "#e2e2e2",
    paddingHorizontal: 20,
    alignSelf: "center",
    height: 60,
  },
  input: {
    flex: 1,
    fontSize: 16,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    height: 40,
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
