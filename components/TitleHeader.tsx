import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import Colors from "@/constants/Colors";

// Add additional properties here if required
interface TitleHeaderProps {
  title: string;
}

/**
 * Title header component for the app
 * @param param0 String title for the header
 * @returns Title header component
 */
export default function TitleHeader({ title }: TitleHeaderProps) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/title-logo.png")}
        style={styles.image}
      />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    position: "absolute",
    top: 0,
    height: 120,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.light.headerBackground,
  },
  title: {
    width: "70%",
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlignVertical: "center",
    margin: "auto",
    paddingHorizontal: "17%",
    paddingTop: 10,
  },
  image: {
    width: 110,
    height: 110,
    padding: 10,
    margin: 10,
    borderRadius: 50,
    backgroundColor: Colors.light.tint,
  },
});
