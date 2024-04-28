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
 * Message component for chat
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
        <View testID="loading-view" style={styles.receivedTextBox}>
          {/* <Text style={styles.text}>...</Text> */}
          {/* <View style={[styles.loading]}></View>
          <View style={[styles.loading, {width: 12, height: 12, borderRadius: 12}]}></View>
          <View style={[styles.loading]}></View> */}
          <ActivityIndicator
            style={{ margin: 5 }}
            size="small"
            color="white"
          />
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
            <View style={styles.receivedTextBox}>
              <Text style={styles.text}>{text}</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.sentTextBox} testID="sentTextBox">
              <Text style={styles.text}>{text}</Text>
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
    padding: 0,
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
    marginVertical: 10,
  },
  sentTextBox: {
    backgroundColor: "#3464ac",
    borderRadius: 15,
    borderBottomEndRadius: 3,
    padding: 10,
  },
  receivedTextBox: {
    backgroundColor: "#363232",
    borderRadius: 15,
    borderBottomStartRadius: 3,
    padding: 10,
    flexDirection: "row",
  },
  text: {
    color: "white",
    fontSize: 16,
  },
  suggestionText: {
    color: "black",
    fontSize: 16,
  },
  sentMessage: {
    justifyContent: "flex-end",
    marginLeft: 100,
  },
  receivedMessage: {
    marginRight: 100,
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
