import React from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from "react-native";
import DirectionStep from "./DirectionStep";
import ModeToggle from "./ModeToggle";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

interface DirectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  directionsSummary: {
    distance: string;
    duration: string;
    steps: Array<{ instruction: string; distance: string }>;
  } | null;
  mode: "WALKING" | "DRIVING";
  toggleMode: () => void;
}

const DirectionModal = ({ isVisible, onClose, directionsSummary, mode, toggleMode }: DirectionModalProps) => {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ModeToggle mode={mode} toggleMode={toggleMode} />
          <Text style={styles.directionsSummaryText}>
            Distance: {directionsSummary?.distance} | Duration: {directionsSummary?.duration}
          </Text>
          <ScrollView style={styles.directionsList}>
            {directionsSummary?.steps.map((step, index) => (
              <DirectionStep key={index} step={step} index={index} totalSteps={directionsSummary.steps.length} />
            ))}
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: wp('5%'),
    alignItems: "center",
  },
  directionsSummaryText: {
    fontSize: wp('4%'),
    marginVertical: hp('0.5%'),
    paddingBottom: hp('0.5%'),
    alignContent: "space-between",
    fontWeight: "bold",
    marginBottom: hp('2%'),
  },
  directionsList: {
    width: "100%",
    height: hp('25%'),
  },
  closeButton: {
    marginTop: hp('2%'),
    backgroundColor: "#000",
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    borderRadius: 5,
    width: "100%",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: wp('4%'),
    alignSelf: "center",
  },
});

export default DirectionModal;
