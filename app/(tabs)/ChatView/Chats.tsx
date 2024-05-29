import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { View } from "@/components/Themed";
import TitleHeader from "@/components/TitleHeader";
import ChatListTabs from "@/components/ChatListTabss";

export default function ChatView() {
  return (
    <View style={styles.container}>
      <TitleHeader title="Chat" />
      <View style={styles.messageContainer}>
        <ChatListTabs />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    flex: 1,
    marginTop: 120,
  },
});
