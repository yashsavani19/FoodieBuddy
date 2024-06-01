import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

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
    width: wp('80%'),
    backgroundColor: "#fff",
    borderRadius: wp('2.5%'),
    padding: wp('5%'),
    alignItems: "center",
  },
  modalTitle: {
    fontSize: wp('5%'),
    fontWeight: "bold",
    marginBottom: hp('2.5%'),
  },
  modalItem: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    width: "100%",
    alignItems: "center",
  },
  modalItemText: {
    fontSize: wp('4%'),
  },
});

export default SettingsModal;
