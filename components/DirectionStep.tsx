import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { getDirectionIcon } from "../app/Utils/directionIcons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

interface DirectionStepProps {
  step: { instruction: string; distance: string };
  index: number;
  totalSteps: number;
}

const DirectionStep = ({ step, index, totalSteps }: DirectionStepProps) => (
  <View>
    <View style={styles.stepContainer}>
      <MaterialIcons
        name={getDirectionIcon(step.instruction)}
        size={wp('6%')}
        color="black"
        style={styles.stepIcon}
      />
      <View style={styles.stepInstructionContainer}>
        <Text style={styles.stepInstruction}>{step.instruction}</Text>
        <Text style={styles.stepDistance}> ({step.distance}) </Text>
      </View>
    </View>
    {index < totalSteps - 1 && <View style={styles.divider} />}
  </View>
);

const styles = StyleSheet.create({
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp('1%'),
    marginTop: hp('1%'),
  },
  stepIcon: {
    marginRight: wp('2%'),
  },
  stepInstructionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    flexShrink: 1,
  },
  stepInstruction: {
    fontSize: wp('3.5%'),
    color: "#555",
    flexShrink: 1,
    flexWrap: "wrap",
    maxWidth: "90%",
  },
  stepDistance: {
    fontSize: wp('3.5%'),
    color: "#555",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: hp('1%'),
  },
});

export default DirectionStep;
