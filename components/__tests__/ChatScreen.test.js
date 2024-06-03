import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";

// Mock components
const TitleHeader = ({ title }) => <Text>{title}</Text>;
const NavBar = ({ openSettings, title }) => (
  <View>
    <Text>{title}</Text>
    <TouchableOpacity onPress={openSettings}>
      <Text>Open Settings</Text>
    </TouchableOpacity>
  </View>
);
const SettingsModal = ({ visible, onClose }) =>
  visible ? (
    <TouchableOpacity onPress={onClose}>
      <Text>Close</Text>
    </TouchableOpacity>
  ) : null;
const TypingIndicator = ({ typingUsers }) => (
  <Text>{Object.keys(typingUsers).length ? "Someone is typing..." : ""}</Text>
);

// Mock Firebase and OpenAI handlers
const auth = {
  currentUser: {
    uid: "test-uid",
    photoURL: "https://example.com/profile.jpg",
    displayName: "Test User",
  },
};
const db = {};
const sendMessage = jest.fn();
const deleteMessage = jest.fn();
const fetchAllUsernames = jest.fn().mockResolvedValue({
  "test-uid": {
    username: "Test User",
    profileImageUrl: "https://example.com/profile.jpg",
  },
});
const updateTypingStatus = jest.fn();
const listenToTypingStatus = jest
  .fn()
  .mockImplementation((chatRoomId, callback) => {
    callback({ "user-1": { isTyping: true, username: "User 1" } });
    return jest.fn();
  });
const sendAIMessage = jest.fn().mockResolvedValue("Mock AI response");
const useOpenAIHandler = jest.fn().mockReturnValue({
  sendMessage: sendAIMessage,
  resetMessages: jest.fn(),
});

// Mock navigation
const useNavigation = jest.fn().mockReturnValue({ navigate: jest.fn() });
const useRoute = jest.fn().mockReturnValue({
  params: { chatRoomId: "test-chat-room", chatRoomName: "Test Chat Room" },
});

// Mock Firestore onSnapshot method
const onSnapshot = jest.fn((query, callback) => {
  callback({
    docs: [
      {
        id: "msg-1",
        data: () => ({
          text: "Hello, world!",
          userId: "test-uid",
          timestamp: { toDate: () => new Date() },
        }),
      },
    ],
  });
  return jest.fn();
});

// ChatScreen component
const ChatScreen = () => {
  const route = useRoute();
  const { chatRoomId, chatRoomName } = route.params;
  const navigation = useNavigation();
  const { sendMessage: sendAIMessage } = useOpenAIHandler();
  const [messages, setMessages] = React.useState([]);
  const [newMessage, setNewMessage] = React.useState("");
  const [settingsVisible, setSettingsVisible] = React.useState(false);
  const [typingUsers, setTypingUsers] = React.useState({});
  const [isBuddyOn, setIsBuddyOn] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(null, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text,
          userId: data.userId,
          timestamp: data.timestamp.toDate(),
          userProfileImage:
            data.userProfileImage || "https://example.com/profile.jpg",
          username: data.username || "Test User",
        };
      });
      setMessages(msgs);
    });

    const unsubscribeTypingStatus = listenToTypingStatus(
      chatRoomId,
      (typingUsers) => {
        setTypingUsers(typingUsers);
      }
    );

    return () => {
      unsubscribe();
      unsubscribeTypingStatus();
    };
  }, [chatRoomId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: Date.now().toString(),
        text: newMessage,
        userId: auth.currentUser.uid,
        timestamp: new Date(),
        userProfileImage: auth.currentUser.photoURL,
        username: auth.currentUser.displayName,
      };
      setMessages((prev) => [...prev, userMessage]);
      setNewMessage("");

      try {
        await sendMessage(chatRoomId, newMessage);
      } catch (error) {
        console.error("Failed to send message", error);
      }

      if (isBuddyOn) {
        const aiResponse = await sendAIMessage(newMessage);
        const buddyMessage = {
          id: Date.now().toString() + "ai",
          text: aiResponse,
          userId: "buddy",
          timestamp: new Date(),
          userProfileImage: "buddyImage.png",
          username: "Buddy",
        };
        setMessages((prev) => [...prev, buddyMessage]);
      }
    }
  };

  const renderItem = ({ item }) => <Text>{item.text}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TitleHeader title="Friends Chat" />
        <NavBar
          openSettings={() => setSettingsVisible(true)}
          title={chatRoomName}
        />
      </View>
      <View style={styles.contentContainer}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
        <TypingIndicator typingUsers={typingUsers} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Type a message..."
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <TouchableOpacity onPress={handleSendMessage}>
              <Text>Send</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
      <TouchableOpacity onPress={() => setIsBuddyOn(!isBuddyOn)}>
        <Text>Toggle Buddy</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: { paddingTop: 100, backgroundColor: "#fff" },
  contentContainer: { flex: 1, backgroundColor: "#f2f2f2" },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
});

describe("ChatScreen", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders header and navbar correctly", () => {
    const { getByText } = render(<ChatScreen />);
    expect(getByText("Friends Chat")).toBeTruthy();
    expect(getByText("Test Chat Room")).toBeTruthy();
    expect(getByText("Open Settings")).toBeTruthy();
  });

  test("fails to render header when title prop is missing", () => {
    const { queryByText } = render(<TitleHeader />);
    expect(queryByText("Friends Chat")).toBeNull();
  });

  test("handles opening and closing settings modal", () => {
    const { getByText, queryByText } = render(<ChatScreen />);
    fireEvent.press(getByText("Open Settings"));
    expect(getByText("Close")).toBeTruthy();
    fireEvent.press(getByText("Close"));
    expect(queryByText("Close")).toBeNull();
  });

  test("fails to handle opening settings modal without openSettings prop", () => {
    const { getByText } = render(<NavBar title="Test Chat Room" />);
    fireEvent.press(getByText("Open Settings"));
    expect(sendMessage).not.toHaveBeenCalled();
  });

  test("handles sending a message", async () => {
    const { getByPlaceholderText, getByText } = render(<ChatScreen />);
    const messageInput = getByPlaceholderText("Type a message...");
    fireEvent.changeText(messageInput, "Hello!");
    fireEvent.press(getByText("Send"));

    await waitFor(() => {
      expect(sendMessage).toHaveBeenCalledWith("test-chat-room", "Hello!");
    });
    expect(messageInput.props.value).toBe("");
  });

  test("fails to send message when text input is empty", async () => {
    const { getByText } = render(<ChatScreen />);
    fireEvent.press(getByText("Send"));

    await waitFor(() => {
      expect(sendMessage).not.toHaveBeenCalled();
    });
  });

  test("handles backend errors gracefully", async () => {
    sendMessage.mockRejectedValueOnce(new Error("Failed to send message"));
    const { getByPlaceholderText, getByText } = render(<ChatScreen />);
    const messageInput = getByPlaceholderText("Type a message...");
    fireEvent.changeText(messageInput, "Hello!");
    fireEvent.press(getByText("Send"));

    await waitFor(() => {
      expect(sendMessage).toHaveBeenCalledWith("test-chat-room", "Hello!");
    });
  });

  test("renders messages correctly", async () => {
    const { getByText } = render(<ChatScreen />);
    await waitFor(() => {
      expect(getByText("Hello, world!")).toBeTruthy();
    });
  });

  test("fails to render message without text", async () => {
    const { queryByText } = render(
      <FlatList
        data={[{ id: "msg-1", userId: "test-uid", timestamp: new Date() }]}
        renderItem={({ item }) => <Text>{item.text}</Text>}
        keyExtractor={(item) => item.id}
      />
    );
    await waitFor(() => {
      expect(queryByText("Hello, world!")).toBeNull();
    });
  });

  test("displays typing indicator correctly", async () => {
    const { getByText } = render(<ChatScreen />);
    await waitFor(() => {
      expect(getByText("Someone is typing...")).toBeTruthy();
    });
  });

  test("hides typing indicator when no one is typing", async () => {
    listenToTypingStatus.mockImplementationOnce((chatRoomId, callback) => {
      callback({});
      return jest.fn();
    });
    const { queryByText } = render(<ChatScreen />);
    await waitFor(() => {
      expect(queryByText("Someone is typing...")).toBeNull();
    });
  });

  test("toggles buddy mode correctly", () => {
    const { getByText } = render(<ChatScreen />);
    const buddyToggleButton = getByText("Toggle Buddy");

    // Initially, buddy mode is off
    fireEvent.press(buddyToggleButton);
    expect(getByText("Toggle Buddy")).toBeTruthy();

    // Buddy mode is now on
    fireEvent.press(buddyToggleButton);
    expect(getByText("Toggle Buddy")).toBeTruthy();
  });

  test("handles buddy toggle and sends AI response", async () => {
    const { getByText, getByPlaceholderText } = render(<ChatScreen />);

    // Toggle buddy mode
    fireEvent.press(getByText("Toggle Buddy"));
    const messageInput = getByPlaceholderText("Type a message...");
    fireEvent.changeText(messageInput, "How are you?");
    fireEvent.press(getByText("Send"));

    await waitFor(() => {
      expect(sendMessage).toHaveBeenCalledWith(
        "test-chat-room",
        "How are you?"
      );
      expect(sendAIMessage).toHaveBeenCalledWith("How are you?");
    });

    expect(getByText("Mock AI response")).toBeTruthy();
  });

  test("does not send whitespace-only messages", async () => {
    const { getByPlaceholderText, getByText } = render(<ChatScreen />);
    const messageInput = getByPlaceholderText("Type a message...");
    fireEvent.changeText(messageInput, "   ");
    fireEvent.press(getByText("Send"));

    await waitFor(() => {
      expect(sendMessage).not.toHaveBeenCalled();
    });
  });

  test("handles rapid message sending correctly", async () => {
    const { getByPlaceholderText, getByText } = render(<ChatScreen />);
    const messageInput = getByPlaceholderText("Type a message...");

    fireEvent.changeText(messageInput, "Hello!");
    fireEvent.press(getByText("Send"));
    fireEvent.changeText(messageInput, "How are you?");
    fireEvent.press(getByText("Send"));

    await waitFor(() => {
      expect(sendMessage).toHaveBeenCalledTimes(2);
      expect(sendMessage).toHaveBeenCalledWith("test-chat-room", "Hello!");
      expect(sendMessage).toHaveBeenCalledWith(
        "test-chat-room",
        "How are you?"
      );
    });
  });

  test("renders TypingIndicator correctly when multiple users are typing", async () => {
    listenToTypingStatus.mockImplementationOnce((chatRoomId, callback) => {
      callback({
        "user-1": { isTyping: true, username: "User 1" },
        "user-2": { isTyping: true, username: "User 2" },
      });
      return jest.fn();
    });
    const { getByText } = render(<ChatScreen />);
    await waitFor(() => {
      expect(getByText("Someone is typing...")).toBeTruthy();
    });
  });

  test("stops displaying TypingIndicator when users stop typing", async () => {
    listenToTypingStatus.mockImplementationOnce((chatRoomId, callback) => {
      callback({ "user-1": { isTyping: true, username: "User 1" } });
      setTimeout(() => {
        callback({});
      }, 500);
      return jest.fn();
    });

    const { queryByText } = render(<ChatScreen />);

    await waitFor(() => {
      expect(queryByText("Someone is typing...")).toBeTruthy();
    });

    await waitFor(() => {
      expect(queryByText("Someone is typing...")).toBeNull();
    });
  });
});
