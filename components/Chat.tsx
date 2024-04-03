import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import Message from "./Message";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import OpenAIHandler from "@/controller/OpenAIHandler";

const openAIChatService = new OpenAIHandler();

interface Message {
  id: string;
  text: string;
  imageUrl: string;
  type?: "sent" | "received";
}

const userImageUrl = "../assets/images/user-icon.png";
const buddyImageUrl = "../assets/images/buddy-icon.png";

async function getResponse(message: string) {
  const response = await openAIChatService.sendMessage(message);
  console.log(response);
  return response;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    // Sample messages
    {
      id: "1",
      text: "Hi! I'm Buddy, your friendly foodie guide at your service! Looking for some tasty bites? Just let me know what you're craving, and I'll whip up a list of great places for you to check out. Whether it's burgers, pizza, tacos, or something fancy, I've got you covered! So, what's on your mind?",
      imageUrl: require("../assets/images/buddy-icon.png"),
      type: "received",
    },
    {
      id: "2",
      text: "Thanks but I didn't ask",
      imageUrl: require("../assets/images/user-icon.png"),
      type: "sent",
    },
    {
      id: "3",
      text: ":(",
      imageUrl: require("../assets/images/buddy-icon.png"),
      type: "received",
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = () => {
    if (currentMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: currentMessage,
        imageUrl: require("../assets/images/user-icon.png"),
        type: "sent",
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setCurrentMessage("");
    }
  };

  const resetMessages = () => {
    getResponse("How many countires are there?");
    console.log(`${process.env.OPENAI_API_KEY}`);
    setMessages([]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <Message text={item.text} imageUrl={item.imageUrl} type={item.type} />
        )}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={currentMessage}
          onChangeText={setCurrentMessage}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
      <View style={{ position: "absolute", top: 10, left: 10 }}>
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
    // backgroundColor: "#e0e0e0",
    padding: 10,
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
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    marginRight: 10,
    paddingLeft: 10,
  },
});

export default Chat;
