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
import OpenAIHandler from "@/controller/OpenAIHandler";
import { initialBuddyMessage } from "@/model/DefaultBuddyMessage";
import Colors from "@/constants/Colors";
import { AppContext } from "@/model/AppContext";
import { Restaurant } from "@/model/Restaurant";

const openAIChatService = new OpenAIHandler();
// const { localRestaurants } = useContext(AppContext);
const localRestaurants: Restaurant[] = [];

/**
 * AI Chat function to send user message to AI and get response
 * @param message user message to send to AI
 * @returns response from AI
 */
async function getAIResponse(message: string) {
  const response = await openAIChatService.sendMessage(message);
  // console.log(response);
  return response;
}

function findRestaurantInMessage(
  latestMessage: string,
) {
  const restaurantNames = localRestaurants.map(
    (restaurant) => restaurant.name
  );
  const restaurant = restaurantNames.find((name) =>
    latestMessage.includes(name)
  );
  return restaurant;
}

/**
 *  Chat component for user to interact with Buddy
 * @returns Chat component with messages, input text box, and send button
 */
const Chat: React.FC = () => {
  const [messages, setMessages] = useState<MessageProps[]>([
    initialBuddyMessage,
  ]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const flatListRef = useRef<FlatList>(null);

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
  const sendMessage = () => {
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

      setMessages((prevMessages) => [...prevMessages, newMessage]); // Display user message
      setMessages((prevMessages) => [...prevMessages, loadingMessage]); // Display loading message
      getAIResponse(currentMessage).then((response) => {
        const newResponse: MessageProps = {
          id: Date.now().toString(),
          text: response,
          imageUrl: require("../assets/images/buddy-icon.png"),
          type: "received",
        };
        setMessages((prevMessages) =>
          prevMessages.slice(0, prevMessages.length - 1)
        ); // Remove loading message
        setMessages((prevMessages) => [...prevMessages, newResponse]); // Display AI response
        const recommendation = findRestaurantInMessage(
          newResponse.text || ""
        );
        if (recommendation) {
          const recommendationMessage: MessageProps = {
            id: Date.now().toString() + "recommendation",
            text: `${recommendation}`,
            type: "suggestion",
          };
          setMessages((prevMessages) => [
            ...prevMessages,
            recommendationMessage,
          ]); // Display recommendation if found
        }
      });
      setCurrentMessage("");
    }
  };

  const resetMessages = () => {
    console.log("Resetting messages");
    openAIChatService.resetMessages();
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
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={currentMessage}
          onChangeText={setCurrentMessage}
          placeholder="Type a message..."
        />
        <View style={{}}>
          <TouchableOpacity onPress={sendMessage}>
            <FontAwesome name="send" size={24} color={Colors.light.iconColor} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ position: "absolute", top: 10, right: 15 }}>
        <TouchableOpacity onPress={resetMessages}>
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
