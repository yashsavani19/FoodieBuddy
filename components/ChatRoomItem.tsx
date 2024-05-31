import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/navigationTypes";
import { MaterialIcons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

type ChatRoom = {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
  timestamp: Date;
};

type ChatRoomItemProps = {
  chatRoom: ChatRoom;
  onDelete: (id: string) => void;
  type: string;
};

const ChatRoomItem: React.FC<ChatRoomItemProps> = ({ chatRoom, onDelete, type }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handlePress = () => {
    if (type === "buddy") {
      navigation.navigate("BuddyChat", { chatRoomId: chatRoom.id });
    } else {
      navigation.navigate('ChatScreen', {
        chatRoomId: chatRoom.id,
        chatRoomName: chatRoom.name,
      });
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Chat Room",
      `Are you sure you want to delete the chat room "${chatRoom.name}"?`,
      [
        {
          text: "Cancel",
          style:
          "cancel",
        },
        {
          text: "Delete",
          onPress: () => onDelete(chatRoom.id),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.chatRoomContainer}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: chatRoom.avatar || "https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg",
            }}
            style={styles.avatar}
          />
        </View>
        <View style={styles.chatRoomInfo}>
          <Text style={styles.chatRoomName}>{chatRoom.name}</Text>
          <View style={styles.timestampContainer}>
            <Text style={styles.chatRoomLastMessage}>{chatRoom.lastMessage}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={confirmDelete} style={styles.deleteButton}>
          <MaterialIcons name="remove" size={wp('6%')} color="red" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatRoomContainer: {
    flexDirection: "row",
    padding: wp('3%'),
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    backgroundColor: "#ffffff",
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp('2%'),
  },
  avatar: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: "#ccc",
  },
  chatRoomInfo: {
    justifyContent: "center",
    flex: 1,
  },
  chatRoomName: {
    fontSize: wp('4.5%'),
    fontWeight: "500",
    color: "#000000",
  },
  chatRoomLastMessage: {
    color: "#888",
    fontSize: wp('3.5%'),
  },
  deleteButton: {
    padding: wp('2.5%'),
    borderRadius: wp('2.5%'),
    justifyContent: "center",
    alignItems: "center",
  },
  timestampContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
  },
});

export default ChatRoomItem;
