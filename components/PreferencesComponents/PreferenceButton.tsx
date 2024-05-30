import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface PreferenceButtonProps {
  name: string;
  selected: boolean;
  onToggle: () => void;
}

const PreferenceButton: React.FC<PreferenceButtonProps> = ({
  name,
  selected,
  onToggle,
}) => {
  function setSelectedColor() {
    return selected ? "#F26722" : "#727272";
  }
  return (
    <TouchableOpacity
      style={[styles.button, { borderColor: setSelectedColor() }]}
      onPress={onToggle}
    >
      <Text style={[styles.buttonText, { color: setSelectedColor() }]}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 100,
    borderWidth: 2.5,
    padding: 3,
    paddingHorizontal: 10,
    borderColor: "#363232",
    marginHorizontal: 2,
    marginVertical: 2,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default PreferenceButton;
