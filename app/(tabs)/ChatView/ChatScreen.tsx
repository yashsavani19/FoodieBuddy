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
  ActivityIndicator,
  Pressable,
} from "react-native";
import {
  useRoute,
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";
import {
  sendMessage,
  deleteMessage,
  fetchAllUsernames,
  updateTypingStatus,
  listenToTypingStatus,
  listenToRecommendedRestaurants,
  storeRecommendedRestaurants,
  clearRecommendedRestaurants,
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
import { ImageSourcePropType } from "react-native";
import { Message } from "@/model/Message";
import { GroupChatDefaultSystemPrompt } from "@/model/DefaultGroupChatAISystemPrompt";
import { AppContext } from "@/context/AppContext";
import { Restaurant } from "@/model/Restaurant";
import RestaurantListItem from "@/components/RestaurantListItem";
import { AntDesign } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

interface RouteParams {
  chatRoomId: string;
  chatRoomName?: string;
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
  const buddyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const buddyProfileImage = require("../../../assets/images/buddy-toggle-on.png");
  const [buddyActive, setBuddyActive] = useState(false);
  const [recommendedRestaurants, setRecommendedRestaurants] = useState<
    Restaurant[]
  >([]);
  const screenWidth = Dimensions.get("window").width;

  // Set system prompt for the chat room
  useEffect(() => {
    const systemPrompt = GroupChatDefaultSystemPrompt(localRestaurants, []);
    setSystemPrompt(systemPrompt);
  }, []);

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

    // Listens to recommended restaurants from buddy
    const unsubscribeRecommnededRestaurants = listenToRecommendedRestaurants(
      chatRoomId,
      (restaurants) => {
        setRecommendedRestaurants(restaurants);
      }
    );

    return () => {
      isMounted = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      unsubscribeTypingStatus();
      unsubscribeRecommnededRestaurants();
    };
  }, [chatRoomId]);

  useEffect(() => {
    const buddyTyping = Object.values(typingUsers).some(
      (user) => user.username === "Buddy" && user.isTyping
    );
    if (buddyTyping) {
      setBuddyActive(true);
    } else {
      setBuddyActive(false);
    }
  }, [typingUsers]);

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
    if (buddyTimeoutRef.current) {
      clearTimeout(buddyTimeoutRef.current);
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
    }, 2000);
    buddyTimeoutRef.current = setTimeout(() => {
      updateTypingStatus(chatRoomId, "Buddy", "Buddy", false);
    }, 6000);
  };

  const handleBuddyPress = async () => {
    await updateTypingStatus(chatRoomId, "Buddy", "Buddy", true);

    const systemPrompt = GroupChatDefaultSystemPrompt(localRestaurants, []);
    setSystemPrompt(systemPrompt);

    // compile recent messages and send to AI
    let recentMessages: string = messages
      .filter((msg) => msg.username !== "Buddy")
      .map((msg) => `${msg.username}: ${msg.text}`)
      .join("\n");

    console.log("Recent Messages:", recentMessages);
    try {
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

      // Clear and store recommended restaurants from AI response
      await clearRecommendedRestaurants(chatRoomId);
      const recommended = findRestaurantsInMessage(aiResponse);
      if (recommended) {
        await storeRecommendedRestaurants(chatRoomId, recommended);
      }

      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage =
        "Sorry, I'm having trouble right now. Please try again later.";
      const buddyMessageId = Date.now().toString() + "ai";
      const buddyMessage: Message = {
        id: buddyMessageId,
        text: errorMessage,
        userId: "buddy",
        timestamp: new Date(),
        userProfileImage: buddyProfileImage,
        username: "Buddy",
      };
      await sendMessage(chatRoomId, errorMessage, "buddy");
    } finally {
      updateTypingStatus(chatRoomId, "Buddy", "Buddy", false);
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isCurrentUser = item.userId === auth.currentUser?.uid;
    const formattedDate = new Date(item.timestamp).toLocaleString();

    const profileImageUri =
      item.userProfileImage ||
      "https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg";

    return (
      <Pressable
        onPress={() => confirmDeleteMessage(item.id)}
        disabled={
          item.userId !== auth.currentUser?.uid && item.userId !== "buddy"
        }
      >
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
      </Pressable>
    );
  };

  const recommendedRestaurantsView = () => {
    return (
      <>
        {recommendedRestaurants.length !== 0 && (
          <View>
            <TouchableOpacity
              onPress={() => {
                clearRecommendedRestaurants(chatRoomId);
              }}
              style={{
                position: "absolute",
                left: 10,
                top: 10,
                backgroundColor: "#fff",
                borderRadius: 20,
                padding: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                zIndex: 1,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <AntDesign name="close" size={20} color="#f76116" />
            </TouchableOpacity>
            <FlatList
              data={recommendedRestaurants}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <RestaurantListItem
                  restaurant={item}
                  style={{ marginRight: 6, width: wp('90%'), borderRadius: 10 }}
                />
              )}
              horizontal={true}
              contentContainerStyle={{ paddingHorizontal: 10 }}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
      </>
    );
  };

  function findRestaurantsInMessage(latestMessage: string) {
    const restaurantNames = localRestaurants.map(
      (restaurant) => restaurant.name
    );
    const foundNames = restaurantNames.filter((name) =>
      latestMessage.includes(name)
    );

    if (foundNames.length > 0) {
      const recommendations = localRestaurants
        .filter((r) => foundNames.includes(r.name))
        .reverse();
      console.log("Recommendations:", recommendations);
      return recommendations;
    }

    return [];
  }

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
        <NavBar openSettings={openSettings} title={chatRoomName} />
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
          ListFooterComponent={recommendedRestaurantsView()}
        />
        <TypingIndicator typingUsers={typingUsers} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inputContainer}>
            {buddyActive ? (
              <View style={{ marginRight: 14 }}>
                <ActivityIndicator size="large" color="#f76116" />
              </View>
            ) : (
              <TouchableOpacity onPress={handleBuddyPress}>
                <Image
                  source={require("../../../assets/images/buddy-toggle-on.png")}
                  style={styles.image}
                />
              </TouchableOpacity>
            )}
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
              <FontAwesome name="send" size={wp('6%')} color="#f76116" />
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
    paddingBottom: hp('5%'),
  },
  messageContainer: {
    marginVertical: hp('1%'),
    paddingHorizontal: wp('2%'),
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
    maxWidth: wp('80%'),
  },
  profileImageContainer: {
    alignItems: "center",
    marginHorizontal: wp('3%'),
    width: wp('10%'),
  },
  profileImage: {
    width: wp('11%'),
    height: wp('11%'),
    borderRadius: wp('11%') / 2,
  },
  messageBubble: {
    borderRadius: wp('5%'),
    padding: wp('3%'),
    maxWidth: wp('70%'),
  },
  currentUserMessage: {
    backgroundColor: "#f76116",
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
    marginRight: wp('2%'),
    marginLeft: wp('5%'),
  },
  otherUserMessage: {
    backgroundColor: "#d3d3d3",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
    marginRight: wp('7.5%'),
  },
  messageText: {
    fontSize: wp('4%'),
    color: "#fff",
    fontWeight: "500",
  },
  otherUserMessageText: {
    fontSize: wp('4%'),
    color: "#000",
    fontWeight: "500",
  },
  timestampText: {
    fontSize: wp('3%'),
    color: "#888",
    alignSelf: "center",
    marginBottom: hp('0.5%'),
  },
  usernameText: {
    fontSize: wp('3%'),
    fontWeight: "bold",
    color: "#555",
    marginBottom: hp('0.5%'),
    textAlign: "center",
    width: wp('15%'),
    maxWidth: wp('10%'),
  },
  inputContainer: {
    flexDirection: "row",
    padding: wp('2%'),
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderColor: "#e2e2e2",
    paddingHorizontal: wp('5%'),
    alignSelf: "center",
    height: hp('7.5%'),
  },
  input: {
    flex: 1,
    fontSize: wp('4%'),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: wp('5%'),
    paddingHorizontal: wp('3%'),
    backgroundColor: "#fff",
    height: hp('5%'),
  },
  sendButton: {
    marginLeft: wp('2%'),
  },
  image: {
    width: wp('10.5%'),
    height: wp('10.5%'),
    marginRight: wp('2%'),
  },
});

export default ChatScreen;
