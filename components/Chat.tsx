import React, { useState, useRef, useEffect } from "react";
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
import Message from "./Message";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import OpenAIHandler from "@/controller/OpenAIHandler";
import { initialBuddyMessage } from "@/model/DefaultBuddyMessage";

const openAIChatService = new OpenAIHandler();

interface Message {
  id: string;
  text: string;
  imageUrl: string;
  type?: "sent" | "received";
}

const userImageUrl = "../assets/images/user-icon.png";
const buddyImageUrl = "../assets/images/buddy-icon.png";

async function getAIResponse(message: string) {
  const response = await openAIChatService.sendMessage(message);
  // console.log(response);
  return response;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
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

  const sendMessage = () => {
    if (currentMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: currentMessage,
        imageUrl: require("../assets/images/user-icon.png"),
        type: "sent",
      };
      getAIResponse(currentMessage).then((response) => {
        const newResponse: Message = {
          id: Date.now().toString(),
          text: response,
          imageUrl: require("../assets/images/buddy-icon.png"),
          type: "received",
        };
        setMessages((prevMessages) => [...prevMessages, newResponse]);
      });
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setCurrentMessage("");
    }
  };

  const resetMessages = () => {
    console.log("Resetting messages");
    setMessages([initialBuddyMessage]);
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
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    marginRight: 10,
    paddingLeft: 10,
  },
});

export default Chat;
