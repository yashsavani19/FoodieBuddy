import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Settings</Text>
            <TouchableOpacity onPress={() => { /* Handle Profile navigation */ }} style={styles.modalItem}>
              <Text style={styles.modalItemText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { /* Handle Notifications navigation */ }} style={styles.modalItem}>
              <Text style={styles.modalItemText}>Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { /* Handle Logout */ }} style={styles.modalItem}>
              <Text style={styles.modalItemText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.modalItem}>
              <Text style={[styles.modalItemText, { color: "red" }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
    alignItems: "center",
  },
  modalItemText: {
    fontSize: 16,
  },
});

export default SettingsModal;
