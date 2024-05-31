import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
  ActivityIndicator,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

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
    padding: wp('1.25%'),
    alignItems: "center",
    marginBottom: hp('1.25%'),
  },
  buddyContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginRight: wp('2%'),
    marginLeft: wp('1%'),
  },
  buddyName: {
    fontSize: wp('3%'),
    fontWeight: "bold",
    color: "#555",
    marginBottom: hp('0.5%'),
  },
  image: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    paddingHorizontal: wp('0.5%'),
  },
  currentUserMessage: {
    backgroundColor: "#f76116",
    borderRadius: wp('5%'),
    padding: wp('2.5%'),
    maxWidth: wp('80%'),
    borderBottomRightRadius: 0,
    marginRight: wp('2.5%'),
  },
  buddyMessage: {
    backgroundColor: "#d3d3d3",
    borderRadius: wp('5%'),
    padding: wp('2.5%'),
    maxWidth: wp('80%'),
    borderBottomLeftRadius: 0,
    marginLeft: wp('1.25%'),
  },
  buddyText: {
    color: "#000",
    fontSize: wp('4%'),
    fontWeight: '500',
  },
  currentUserText: {
    color: "#fff",
    fontSize: wp('4%'),
    fontWeight: '500',
  },
  suggestionText: {
    color: "black",
    fontSize: wp('4%'),
  },
  sentMessage: {
    justifyContent: "flex-end",
    marginLeft: wp('25%'),
  },
  receivedMessage: {
    justifyContent: "flex-start",
    marginRight: wp('25%'),
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