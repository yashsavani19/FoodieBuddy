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
                    fontSize: 20,
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
            <Text style={styles.textStyle}>Already Have an Account?</Text>
            <Link href={"/LoginView"}>
              <Text style={styles.clickableText}> Login Now!</Text>
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
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },

  googleRegisterContainer: {
    width: 300,
    height: 50,
    borderRadius: 15,
    margin: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#373737",
    marginBottom: 30,
  },
  googleText: {
    color: "white",
    width: 190,
    fontSize: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "right",
  },

  innerContainer: {
    marginTop: 30,
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f26722",
  },
  inputContainer: {
    width: 300,
    height: 50,
    borderRadius: 15,
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: "transparent",
    borderWidth: 1,
  },

  inputLogo: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    margin: 15,
  },

  logo: {
    width: "100%",
    height: 200,
    marginTop: 75,
    resizeMode: "contain",
  },

  buttonContainer: {
    backgroundColor: "#f26722",
  },

  registerButton: {
    width: 200,
    borderRadius: 15,
    backgroundColor: "#3464AC",
    marginTop: 20,
    marginBottom: 15,
    height: 45,
    justifyContent: "center",
  },

  clickableText: {
    color: "blue",
    textDecorationLine: "underline",
    fontSize: 15,
  },

  textStyle: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },

  createAccountContainer: {
    backgroundColor: "#f26722",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    margin: 10,
  },
});
