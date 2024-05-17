import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

interface BaseButtonProps {
  title?: string;
  buttonColour: string;
  onPress?: () => void;
}

const BaseButton: React.FC<BaseButtonProps> = ({
  title,
  onPress,
  buttonColour,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: buttonColour }]}
      onPress={onPress}
    >
      <View>
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default BaseButton;

const styles = StyleSheet.create({
  button: {
    width: "100%",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "white",
  },
});
