import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";

interface MessageProps {
  imageUrl: ImageSourcePropType;
  text: string;
  type: "sent" | "received";
}

const Message: React.FC<MessageProps> = ({ imageUrl, text, type }) => {
  const isSentMessage = type === "sent";
  return (
    <View
      style={[
        styles.messageContainer,
        isSentMessage ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      {type === "received" ? (
        <>
          <Image source={imageUrl} style={styles.image} />
          <View style={styles.receivedTextBox}>
            <Text style={styles.text}>{text}</Text>
          </View>
        </>
      ) : (
        <>
          <View style={styles.sentTextBox}>
            <Text style={styles.text}>{text}</Text>
          </View>
          <Image source={imageUrl} style={styles.image} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    padding: 0,
    alignItems: "center",
    marginBottom: 10,
    // marginRight: 50,
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
  },
  text: {
    color: "white",
  },
  sentMessage: {
    justifyContent: "flex-end",
    marginLeft: 100,
  },
  receivedMessage: {
    marginRight: 100,
  },
});

export default Message;
