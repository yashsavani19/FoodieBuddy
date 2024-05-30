import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ChatList from "./ChatList";
import BuddyChat from "@/app/(tabs)/ChatView/BuddyChat";

const ChatListTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"buddy" | "friends">("friends");

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "buddy" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("buddy")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "buddy" && styles.activeTabButtonText,
            ]}
          >
            Buddy ChatBot
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "friends" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("friends")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "friends" && styles.activeTabButtonText,
            ]}
          >
            Friends Chat
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.chatListContainer}>
        {activeTab === "buddy" ? <BuddyChat/> : <ChatList type="friends" />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1e1e1e",
    paddingVertical: 5,
  },
  tabButton: {
    paddingVertical: 2,
    paddingHorizontal: 20,
  },
  activeTabButton: {
    borderBottomWidth: 3,
    borderBottomColor: "#ff6f00",
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  tabButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  activeTabButtonText: {
    color: "#fff",
  },
  chatListContainer: {
    flex: 1,
  },
});

export default ChatListTabs;
