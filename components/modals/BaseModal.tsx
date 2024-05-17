import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

interface BaseModalProps {
  title?: string;
  bodyText?: string;
  visible?: boolean;
  buttons?: React.ReactNode[];
  onClose?: () => void;
}

const BaseModal: React.FC<BaseModalProps> = ({
  title,
  bodyText,
  visible,
  buttons,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalBackground} onPress={onClose}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.bodyText}>{bodyText}</Text>
          <View style={styles.buttonContainer}>
            {buttons?.map((button, index) => (
              <View key={index}>{button}</View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default BaseModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent dark background
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    elevation: 10, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  bodyText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});
