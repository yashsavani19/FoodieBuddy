import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { Text, View } from "@/components/Themed";
import TitleHeader from "@/components/TitleHeader";
import Chat from "@/components/Chat";
import { Alert } from "react-native";
import { useFocusEffect } from "expo-router";

export default function ChatView() {
  // Display "AI-learning" alert message when user enters the chat view
  useFocusEffect(
    React.useCallback(() => {
      Alert.alert("For your information", "Buddy is still learning, please be patient and understand that they can still make mistakes from time to time. Please check with the restaurant for allergen information.");
      return () => {
      };
    }, [])
  );

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
