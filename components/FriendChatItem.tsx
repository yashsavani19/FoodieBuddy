import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

interface Friend {
  id: string;
  name: string;
  avatar: string;
  isAdded: boolean;
}

interface FriendItemProps {
  friend: Friend;
  toggleFriendAdded: (id: string) => void;
}

const FriendItem: React.FC<FriendItemProps> = ({ friend, toggleFriendAdded }) => {
  return (
    <View style={styles.friendContainer}>
      <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
      <Text style={styles.friendName}>{friend.name}</Text>
      <TouchableOpacity
        style={[styles.addButton, friend.isAdded && styles.addedButton]}
        onPress={() => toggleFriendAdded(friend.id)}
      >
        <Text
          style={[styles.addButtonText, friend.isAdded && styles.addedButtonText]}
        >
          {friend.isAdded ? "Added" : "Add"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  friendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  friendName: {
    flex: 1,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  addedButton: {
    backgroundColor: "#ccc",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 12,
  },
  addedButtonText: {
    color: "#000",
  },
});

export default FriendItem;
