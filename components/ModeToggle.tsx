import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

interface ModeToggleProps {
  mode: "WALKING" | "DRIVING";
  toggleMode: () => void;
}

const ModeToggle = ({ mode, toggleMode }: ModeToggleProps) => (
  <TouchableOpacity style={styles.modeToggleWrapper} onPress={toggleMode}>
    <View style={styles.modeToggleContainer}>
      <MaterialCommunityIcons
        name="walk"
        size={wp('5%')}
        color={mode === "WALKING" ? "#e46860" : "#fff"}
      />
      <MaterialCommunityIcons
        name="car"
        size={wp('6%')}
        color={mode === "DRIVING" ? "#e46860" : "#fff"}
      />
      <Text style={styles.modeToggleText}>
        {mode === "WALKING" ? "Walking Directions" : "Driving Directions"}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  modeToggleWrapper: {
    width: wp("80%"),
    height: hp("6%"),
    backgroundColor: "#000",
    borderRadius: 10,
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    marginBottom: hp('2%'),
  },
  modeToggleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modeToggleText: {
    fontSize: wp('4%'),
    fontWeight: "bold",
    color: "#fff",
    marginLeft: wp('2%'),
    left: wp('4%'),
  },
});

export default ModeToggle;
