import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import Message, { MessageProps } from "./Message";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useOpenAIHandler } from "@/controller/OpenAIHandler";
import { initialBuddyMessage } from "@/model/DefaultBuddyMessage";
import Colors from "@/constants/Colors";
import { AppContext } from "@/model/AppContext";
import { Restaurant } from "@/model/Restaurant";
import RestaurantListItem from "./RestaurantListItem";

/**
 *  Chat component for user to interact with Buddy
 * @returns Chat component with messages, input text box, and send button
 */
const Chat: React.FC = () => {
  const { localRestaurants } = useContext(AppContext);
  const { sendMessage } = useOpenAIHandler();
  const [messages, setMessages] = useState<MessageProps[]>([
    initialBuddyMessage,
  ]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const flatListRef = useRef<FlatList>(null);
  const [recommendedRestaurant, setRecommendedRestaurant] =
    useState<Restaurant | null>(null);

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

  useEffect(() => {
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  }, [messages]);

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
    if (currentMessage.trim()) {
      const newMessage: MessageProps = {
        id: Date.now().toString(),
        text: currentMessage,
        imageUrl: require("../assets/images/user-icon.png"),
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
            imageUrl: require("../assets/images/buddy-icon.png"),
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
    const { resetMessages } = useOpenAIHandler();
    console.log("Resetting messages");
    resetMessages();
    setMessages([initialBuddyMessage]);
  };

  /**
   * Chat component with messages, input text box, and send button
   */
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
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
        ListHeaderComponent={<View style={{ height: 10 }} />}
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
        <View style={{}}>
          <TouchableOpacity onPress={sendMessageFromUser}>
            <FontAwesome name="send" size={24} color={Colors.light.iconColor} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ position: "absolute", top: 10, right: 15 }}>
        <TouchableOpacity onPress={resetChatMessages}>
          <FontAwesome name="repeat" size={24} color="grey" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5,
  },
  messagesList: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    marginRight: 10,
    paddingLeft: 10,
  },
});

export default Chat;
