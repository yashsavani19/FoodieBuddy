import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface TypingIndicatorProps {
  typingUsers: { [key: string]: { isTyping: boolean; username: string } };
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  const typingUsernames = Object.values(typingUsers)
    .filter((user) => user.isTyping)
    .map((user) => user.username)
    .join(", ");

  if (!typingUsernames) return null;

  return (
    <View style={styles.typingIndicatorContainer}>
      <Text style={styles.typingText}>{typingUsernames} is typing... </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  typingIndicatorContainer: {
    padding: wp("1%"),
    alignItems: "center",
  },
  typingText: {
    fontSize: wp("3.5%"),
    color: "#999",
  },
});

export default TypingIndicator;
