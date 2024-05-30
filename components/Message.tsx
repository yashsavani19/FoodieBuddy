import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
  ActivityIndicator,
} from "react-native";

// Message props interface
export interface MessageProps {
  id?: string;
  imageUrl?: ImageSourcePropType;
  text?: string;
  type: "sent" | "received" | "loading" | "suggestion";
}

/**
 * Message component for chat messages
 * @param param0 Message props
 * @returns Message component
 */
const Message: React.FC<MessageProps> = ({ imageUrl, text, type }) => {
  const isSentMessage = type === "sent";
  if (type === "loading") {
    return (
      <View style={styles.messageContainer}>
        <Image
          source={require("../assets/images/buddy-icon.png")}
          style={styles.image}
        />
        <View testID="loading-view" style={styles.buddyMessage}>
          <ActivityIndicator style={{ margin: 5 }} size="small" color="white" />
        </View>
      </View>
    );
  } else if (type === "suggestion") {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.suggestionText}>Restaurant info panel: {text}</Text>
      </View>
    );
  } else {
    return (
      <View
        style={[
          styles.messageContainer,
          isSentMessage ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        {type === "received" ? (
          <>
            <Image
              testID="message-image"
              source={imageUrl}
              style={styles.image}
            />
            <View style={styles.buddyMessage}>
              <Text style={styles.buddyText}>{text}</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.currentUserMessage} testID="sentTextBox">
              <Text style={styles.currentUserText}>{text}</Text>
            </View>
            <Image
              testID="message-image"
              source={imageUrl}
              style={styles.image}
            />
          </>
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    padding: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
  },
  currentUserMessage: {
    backgroundColor: "#f76116",
    borderRadius: 20,
    padding: 10,
    maxWidth: "95%",
    borderBottomRightRadius: 0,
  },
  buddyMessage: {
    backgroundColor: "#d3d3d3",
    borderRadius: 20,
    padding: 10,
    maxWidth: "95%",
    borderBottomLeftRadius: 0,
  },
  buddyText: {
    color: "#000",
    fontSize: 16,
    fontWeight: '500',
  },
  currentUserText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: '500',
  },
  suggestionText: {
    color: "black",
    fontSize: 16,
  },
  sentMessage: {
    justifyContent: "flex-end",
    marginLeft: "25%",
  },
  receivedMessage: {
    justifyContent: "flex-start",
    marginRight: "25%",
  },
  loading: {
    backgroundColor: "white",
    borderRadius: 8,
    margin: 3,
    width: 8,
    height: 8,
  },
});

export default Message;
