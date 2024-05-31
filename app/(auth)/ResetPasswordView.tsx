import {
  StyleSheet,
  TextInput,
  Button,
  SafeAreaView,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { handleResetPassword } from "@/controller/FirebaseHandler";
import React, { useState } from "react";
import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

// Import the image for the logo
const buddyLogo = require("@/assets/images/title-logo.png");

// Define the LoginView component
export default function LoginView() {
  // State variables to store user registration details
  const [email, setEmail] = useState("");

  return (
    <View style={styles.container}>
      {/* Application logo */}
      <Image source={buddyLogo} style={styles.logo} />
      <ScrollView>
        <SafeAreaView style={styles.innerContainer}>
          {/* Input field for email */}
          <View style={styles.inputContainer}>
            <Image
              source={require("@/assets/images/mail-logo.png")}
              style={styles.inputLogo}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Email To Reset Password"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          {/* Button to trigger password reset */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => handleResetPassword(email)}
            >
              <Text style={styles.resetButtonText}>Send Link to Email </Text>
            </TouchableOpacity>
          </View>
          {/* Link to navigate back to LoginView */}
          <View style={styles.loginAgainContainer}>
            <Text style={styles.textStyle}>Password Reset Done? </Text>
            <Link href={"/LoginView"}>
              <Text style={styles.clickableText}> Login Again! </Text>
            </Link>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f26722",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: wp("5%"),
    fontWeight: "bold",
  },
  innerContainer: {
    marginTop: hp("3%"),
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f26722",
  },
  inputContainer: {
    width: wp("80%"),
    height: hp("6%"),
    borderRadius: 15,
    margin: hp("1%"),
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: hp("6%"),
    borderColor: "transparent",
    borderWidth: 1,
  },
  inputLogo: {
    width: wp("8%"),
    height: hp("6%"),
    resizeMode: "contain",
    margin: wp("2%"),
  },
  logo: {
    width: "100%",
    height: hp("25%"),
    marginTop: hp("10%"),
    resizeMode: "contain",
  },
  buttonContainer: {
    backgroundColor: "#f26722",
  },
  resetButton: {
    width: wp("50%"),
    borderRadius: 15,
    backgroundColor: "#3464AC",
    marginTop: hp("2%"),
    marginBottom: hp("1.5%"),
    height: hp("6%"),
    justifyContent: "center",
    alignItems: "center",
  },
  resetButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: wp("5%"),
  },
  clickableText: {
    color: "blue",
    textDecorationLine: "underline",
    fontSize: wp("4%"),
  },
  textStyle: {
    fontSize: wp("4%"),
    color: "white",
    fontWeight: "bold",
  },
  loginAgainContainer: {
    backgroundColor: "#f26722",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: wp("2%"),
    margin: wp("2%"),
    justifyContent: "center",
  },
});
