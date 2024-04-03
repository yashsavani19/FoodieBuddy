import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { Text, View } from "@/components/Themed";
import TitleHeader from "@/components/TitleHeader";
import Chat from "@/components/Chat";

export default function ChatView() {
  const [headerHeight, setHeaderHeight] = useState(120);

  return (
    <View style={styles.container}>
      <TitleHeader title="Buddy" />
      <View style={styles.messageContainer}>
        <Chat />
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
