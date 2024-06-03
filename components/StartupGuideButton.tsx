import { StyleSheet, Text, View, Image, Modal } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import StartupGuide from "./modals/StartupGuide";

const StartupGuideButton = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image
          source={require("@/assets/images/startup-guide-icon.png")}
          style={styles.startupGuide}
        />
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <StartupGuide />
      </Modal>
    </>
  );
};

export default StartupGuideButton;

const styles = StyleSheet.create({
  startupGuide: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});
