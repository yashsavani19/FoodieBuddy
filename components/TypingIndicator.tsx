import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

interface TypingIndicatorProps {
  typingUsers: { [key: string]: { isTyping: boolean, username: string } };
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  const typingUsernames = Object.values(typingUsers)
    .filter(user => user.isTyping)
    .map(user => user.username)
    .join(", ");

  if (!typingUsernames) return null;

  return (
    <View style={styles.typingIndicatorContainer}>
      <Text style={styles.typingText}>{typingUsernames} is typing...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  typingIndicatorContainer: {
    padding: width * 0.02,
    alignItems: "center",
  },
  typingText: {
    fontSize: width * 0.04,
    color: "#999",
  },
});

export default TypingIndicator;
