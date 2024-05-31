import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
  ActivityIndicator,
  Dimensions,
} from "react-native";

// Message props interface
export interface MessageProps {
  id?: string;
  imageUrl?: ImageSourcePropType;
  text?: string;
  type: "sent" | "received" | "loading" | "suggestion";
}

const {width} = Dimensions.get("window");

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
            <View style={styles.buddyContainer}>
              <Text style={styles.buddyName}>Buddy</Text>
              <Image
                testID="message-image"
                source={imageUrl}
                style={styles.image}
              />
            </View>
            <View style={styles.buddyMessage}>
              <Text style={styles.buddyText}>{text}</Text>
            </View>
          </>
        ) : (
          <View style={styles.currentUserMessage} testID="sentTextBox">
            <Text style={styles.currentUserText}>{text}</Text>
          </View>
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
  buddyContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginRight: 10,
  },
  buddyName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 2,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 2,
  },
  currentUserMessage: {
    backgroundColor: "#f76116",
    borderRadius: 20,
    padding: 10,
    maxWidth: width * 0.80,
    borderBottomRightRadius: 0,
    marginRight: 10,
  },
  buddyMessage: {
    backgroundColor: "#d3d3d3",
    borderRadius: 20,
    padding: 10,
    maxWidth: width * 0.80,
    borderBottomLeftRadius: 0,
    marginLeft: 5,
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
