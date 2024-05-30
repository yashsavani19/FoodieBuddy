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
          style={styles.tabButton}
          onPress={() => setActiveTab("buddy")}
          disabled={activeTab === "buddy"}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "buddy" && styles.activeTabButtonText,
            ]}
          >
            Buddy ChatBot
          </Text>
          <View
            style={[
              styles.underline,
              { backgroundColor: activeTab === "buddy" ? "#F26722" : "#00000000" },
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveTab("friends")}
          disabled={activeTab === "friends"}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "friends" && styles.activeTabButtonText,
            ]}
          >
            Friends Chat
          </Text>
          <View
            style={[
              styles.underline,
              { backgroundColor: activeTab === "friends" ? "#F26722" : "#00000000" },
            ]}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.chatListContainer}>
        {activeTab === "buddy" ? <BuddyChat /> : <ChatList type="friends" />}
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
    backgroundColor: "#363232",
    height: 40,
    alignItems: "center",
  },
  tabButton: {
    flexDirection: "column",
    alignItems: "center",
  },
  tabButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  activeTabButtonText: {
    color: "#fff",
  },
  underline: {
    height: 5,
    backgroundColor: "#F26722",
    width: 120,
    marginBottom: -10,
    borderRadius: 2,
    marginTop: 3,
  },
  chatListContainer: {
    flex: 1,
  },
});

export default ChatListTabs;
