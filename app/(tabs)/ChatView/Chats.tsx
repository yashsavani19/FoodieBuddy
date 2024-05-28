import { StyleSheet } from "react-native";
import React from "react";
import { View } from "@/components/Themed";
import TitleHeader from "@/components/TitleHeader";
import ChatListTabss from "@/components/ChatListTabss";


export default function ChatView() {
  return (
    <View style={styles.container}>
      <TitleHeader title="Chat" />
      <View style={styles.messageContainer}>
        <ChatListTabss />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  messageContainer: {
    flex: 1,
    marginTop: 120,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});