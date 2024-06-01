import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ChatList from "./ChatList";
import BuddyChat from "@/app/(tabs)/ChatView/BuddyChat";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

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
    height: hp('5%'),
    alignItems: "center",
  },
  tabButton: {
    flexDirection: "column",
    alignItems: "center",
  },
  tabButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: wp('4.2%'),
  },
  activeTabButtonText: {
    color: "#fff",
  },
  underline: {
    height: hp('0.6%'),
    backgroundColor: "#F26722",
    width: wp('33%'),
    marginBottom: hp('-1%'),
    borderRadius: wp('0.5%'),
    marginTop: hp('0.5%'),
  },
  chatListContainer: {
    flex: 1,
  },
});

export default ChatListTabs;
