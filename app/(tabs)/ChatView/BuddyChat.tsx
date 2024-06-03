import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import Message, { MessageProps } from "../../../components/Message";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useOpenAIHandler } from "@/controller/OpenAIHandler";
import { initialBuddyMessage } from "@/model/DefaultBuddyMessage";
import Colors from "@/constants/Colors";
import { AppContext } from "@/context/AppContext";
import { Restaurant } from "@/model/Restaurant";
import RestaurantListItem from "../../../components/RestaurantListItem";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import SettingsModal from "@/components/SettingsModal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { DefaultAISystemPrompt } from "@/model/DefaultAISystemPrompt";

// Ensure the paths to the image assets are correct
const userIcon = require("../../../assets/images/user-icon.png");
const buddyIcon = require("../../../assets/images/buddy-icon.png");

/**
 *  BuddyChat component for user to interact with Buddy.
 * User can send messages to Buddy and receive responses from AI.
 * @returns BuddyChat component with messages, input text box, and send button
 */
const BuddyChat: React.FC = () => {
  const { localRestaurants } = useContext(AppContext);
  const { sendMessage, resetMessages, setSystemPrompt } = useOpenAIHandler();
  const [messages, setMessages] = useState<MessageProps[]>([
    initialBuddyMessage,
  ]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [settingsVisible, setSettingsVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [recommendedRestaurant, setRecommendedRestaurant] =
    useState<Restaurant | null>(null);
  const navigation = useNavigation();

  // Display "AI-learning" alert message when user enters the chat view
  useFocusEffect(
    React.useCallback(() => {
      Alert.alert(
        "For your information",
        "Buddy is still learning, please be patient and understand that they can still make mistakes from time to time. Please check with the restaurant for allergen information."
      );
      return () => {};
    }, [])
  );

  useEffect(() => {
    setSystemPrompt(DefaultAISystemPrompt(localRestaurants));
  }, []);

  /**
   * AI Chat function to send user message to AI and get response
   * @param message user message to send to AI
   * @returns response from AI
   */
  async function getAIResponse(message: string) {
    const response = await sendMessage(message);
    // console.log(response);
    return response;
  }

  function findRestaurantInMessage(latestMessage: string) {
    const restaurantNames = localRestaurants.map(
      (restaurant) => restaurant.name
    );
    const restaurant = restaurantNames.find((name) =>
      latestMessage.includes(name)
    );
    if (restaurant) {
      console.log("Restaurant found in message:", restaurant);
      const recommendation = localRestaurants.find(
        (r) => r.name === restaurant
      );
      return recommendation || null;
    }
    return null;
  }

  // Scroll to end of messages when new message is added
  useEffect(() => {
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  }, [messages]);

  // Scroll to end of messages when keyboard is shown
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setTimeout(() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }, 100);
      }
    );
    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  /**
   * Send message to Buddy and get response from AI
   */
  const sendMessageFromUser = () => {
    setRecommendedRestaurant(null);
    if (currentMessage.trim()) {
      const newMessage: MessageProps = {
        id: Date.now().toString(),
        text: currentMessage,
        imageUrl: userIcon,
        type: "sent",
      };

      const loadingMessage: MessageProps = {
        id: Date.now().toString() + "loading",
        type: "loading",
      };

      setMessages((prevMessages) => [
        ...prevMessages,
        newMessage,
        loadingMessage,
      ]); // Display user message and loading message

      getAIResponse(currentMessage)
        .then((response) => {
          const newResponse: MessageProps = {
            id: Date.now().toString(),
            text: response,
            imageUrl: buddyIcon,
            type: "received",
          };

          // Update to handle the removal of the loading message and display of the new response
          setMessages((prevMessages) => [
            ...prevMessages.filter((msg) => msg.id !== loadingMessage.id),
            newResponse,
          ]);

          const restaurant = findRestaurantInMessage(newResponse.text || "");
          setRecommendedRestaurant(restaurant); // Set the restaurant found directly, null if none found
        })
        .catch((error) => {
          console.error("Failed to send message:", error);
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== loadingMessage.id)
          ); // Remove loading message
        });
      setCurrentMessage("");
    }
  };

  const resetChatMessages = () => {
    console.log("Resetting messages");
    resetMessages();
    setMessages([initialBuddyMessage]);
    setRecommendedRestaurant(null);
  };

  const openSettings = () => {
    setSettingsVisible(true);
  };

  const closeSettings = () => {
    setSettingsVisible(false);
  };

  /**
   * BuddyChat component with messages, input text box, and send button
   */
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={({ item }) => (
                <Message
                  id={item.id}
                  text={item.text}
                  imageUrl={item.imageUrl}
                  type={item.type}
                />
              )}
              keyExtractor={(item) => item.id}
              style={styles.messagesList}
              contentContainerStyle={{ paddingBottom: hp("1.5%") }}
              ListHeaderComponent={<View style={{ height: hp("1.5%") }} />}
              ListFooterComponent={
                recommendedRestaurant ? (
                  <RestaurantListItem restaurant={recommendedRestaurant} />
                ) : null
              }
            />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={currentMessage}
                onChangeText={setCurrentMessage}
                placeholder="Type a message..."
              />
              <TouchableOpacity onPress={sendMessageFromUser}>
                <FontAwesome
                  name="send"
                  size={wp("6%")}
                  color={Colors.light.iconColor}
                  style={styles.sendButton}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableOpacity
          onPress={resetChatMessages}
          style={{ position: "absolute", top: hp("1.5%"), right: wp("5%") }}
        >
          <FontAwesome name="repeat" size={wp("6%")} color="grey" />
        </TouchableOpacity>
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
    paddingTop: hp("15%"),
    backgroundColor: "#fff",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#f2f2f2",
  },
  messagesList: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    padding: wp("2.5%"),
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderColor: "#e2e2e2",
    width: "95%",
    alignSelf: "center",
    borderRadius: wp("5%"),
    height: hp("8%"),
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    fontSize: wp("4%"),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: wp("5%"),
    paddingHorizontal: wp("4%"),
    backgroundColor: "#fff",
    height: hp("5.5%"),
  },
  sendButton: {
    marginLeft: wp("2.5%"),
  },
});

export default BuddyChat;
