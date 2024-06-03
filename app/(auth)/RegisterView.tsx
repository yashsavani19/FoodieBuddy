import {
  StyleSheet,
  TextInput,
  Button,
  SafeAreaView,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";
import { Text, View } from "@/components/Themed";
import { useAuth } from "@/context/AuthContext";
import { checkUsername } from "@/controller/DatabaseHandler";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

// Import the image for the logo
const buddyLogo = require("@/assets/images/title-logo.png");

// Define the RegisterView component
export default function RegisterView() {
  // Retrieve the signUp function from the AuthContext
  const { signUp } = useAuth();

  // State variables to store user registration details
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerEnabled, setRegisterEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Function to validate the username
  const handleUsernameValidation = async () => {
    if (username.length < 3 && username !== "") {
      alert("Username must be at least 3 characters long");
      setLoading(false);
      return;
    }
    if (username !== "") {
      const result = await checkUsername(username);
      if (result) {
        alert("Username already exists");
        setLoading(false);
      }
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    const result = await signUp(email, username, password, confirmPassword);
    if (!result) {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Scrollable container */}
      <ScrollView>
        {/* Application logo */}
        <Image source={buddyLogo} style={styles.logo} />
        <SafeAreaView style={styles.innerContainer}>
          {/* Username input */}
          <View style={styles.inputContainer}>
            <Image
              source={require("@/assets/images/username-logo.png")}
              style={styles.inputLogo}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              onBlur={handleUsernameValidation}
            />
          </View>
          {/* Email input */}
          <View style={styles.inputContainer}>
            <Image
              source={require("@/assets/images/mail-logo.png")}
              style={styles.inputLogo}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          {/* Password input */}
          <View style={styles.inputContainer}>
            <Image
              source={require("@/assets/images/lock-logo.png")}
              style={styles.inputLogo}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {/* Confirm password input */}
          </View>
          <View style={styles.inputContainer}>
            <Image
              source={require("@/assets/images/lock-logo.png")}
              style={styles.inputLogo}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          {/* Register Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleSignUp}
            >
              {!loading ? (
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "600",
                    fontSize: wp("5%"),
                  }}
                >
                  Register
                </Text>
              ) : (
                <ActivityIndicator
                  size="large"
                  color="#fff"
                  animating={loading}
                  style={{ marginTop: 10 }}
                ></ActivityIndicator>
              )}
            </TouchableOpacity>
          </View>
          {/* Login Button*/}
          <View style={styles.createAccountContainer}>
            <Text style={styles.textStyle}>Already Have an Account? </Text>
            <Link href={"/LoginView"}>
              <Text style={styles.clickableText}>Login Now! </Text>
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
  separator: {
    marginVertical: hp("3%"),
    height: 1,
    width: "80%",
  },
  googleRegisterContainer: {
    width: wp("80%"),
    height: hp("6%"),
    borderRadius: 15,
    margin: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#373737",
    marginBottom: hp("3%"),
  },
  googleText: {
    color: "white",
    width: wp("50%"),
    fontSize: wp("5%"),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "right",
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
  registerButton: {
    width: wp("50%"),
    borderRadius: 15,
    backgroundColor: "#3464AC",
    marginTop: hp("2%"),
    marginBottom: hp("1.5%"),
    height: hp("6%"),
    justifyContent: "center",
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
  createAccountContainer: {
    backgroundColor: "#f26722",
    width: "100%",
    flexDirection: "row",
    // alignItems: "center",
    padding: wp("2%"),
    margin: wp("2%"),
    justifyContent: 'center'
  },
});
