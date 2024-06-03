import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal } from "react-native";
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
  const [modalVisible, setModalVisible] = useState(false);

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
    setModalVisible(true);
  };

  const handleDelete = () => {
    onDelete(chatRoom.id);
    setModalVisible(false);
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
        <TouchableOpacity onPress={confirmDelete} style={styles.deleteIcon}>
          <MaterialIcons name="remove" size={wp('6%')} color="red" />
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Delete Chat Room</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete the chat room "{chatRoom.name}"?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                style={[styles.modalButton, styles.deleteButton]}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  deleteIcon: {
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: wp('80%'),
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: wp('5%'),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: wp('4.5%'),
    fontWeight: "bold",
    marginBottom: hp('2%'),
  },
  modalMessage: {
    fontSize: wp('4%'),
    textAlign: "center",
    marginBottom: hp('2%'),
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: hp('1.2%'),
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: wp('1%'),
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
  cancelButtonText: {
    color: "#000",
  },
  deleteButtonText: {
    color: "#fff",
  },
});

export default ChatRoomItem;
