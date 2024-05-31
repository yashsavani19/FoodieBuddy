import { View, Text, Pressable, Share } from "react-native";
import React from "react";
import { Octicons } from "@expo/vector-icons";
import { Restaurant } from "@/model/Restaurant";

interface ShareButtonProps {
  restaurant: Restaurant;
  size: number;
}

const ShareButton: React.FC<ShareButtonProps> = ({ restaurant, size }) => {
  //Function to share the restaurant details
  const onShare = async () => {
    let message = `Check out ${restaurant.name} at ${restaurant.displayAddress}!`;
    if (restaurant.website) {
      message += ` Website: ${restaurant.website}`;
    }
    try {
      const result = await Share.share({
        message: message,
        title: restaurant.name,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log("Shared with activity type: " + result.activityType);
        } else {
          // shared
          console.log("Shared");
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log("Dismissed");
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <View>
      <Pressable onPress={onShare}>
        <Octicons name="share" size={size} color={"#363232"}/>
      </Pressable>
    </View>
  );
};

export default ShareButton;
