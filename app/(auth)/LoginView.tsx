import {
  StyleSheet,
  TextInput,
  Button,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { Platform } from "react-native";

import React, { useEffect, useState } from "react";
import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";
import { useAuth } from "@/context/AuthContext";

// Import the image for the logo
const buddyLogo = require("@/assets/images/title-logo.png");

// Define the LoginView component
export default function LoginView() {
  // State variables to store email and password entered by the user
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Retrieve the signIn function from the AuthContext
  const { signIn } = useAuth();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => backHandler.remove()
  }, [])

  const handleLogin = async () => {
    setLoading(true);
    const result = await signIn(email, password);
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
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
            />
            {/* Password input */}
          </View>
          <View style={styles.inputContainer}>
            <Image
              source={require("@/assets/images/lock-logo.png")}
              style={styles.inputLogo}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
          </View>
          {/* Login Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              {!loading ? (
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "600",
                    fontSize: 20,
                  }}
                >
                  Login
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
          {/* Forgot Password Link */}
          <Link href={"/ResetPasswordView"}>
            <Text style={styles.clickableText}> Forgot Password?</Text>
          </Link>
          {/* Create Account Button*/}
          <View style={styles.createAccountContainer}>
            <Text style={styles.textStyle}>Don't Have an Account yet?</Text>
            <Link href={"/RegisterView"}>
              <Text style={styles.clickableText}> Register Now!</Text>
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

  googleLoginContainer: {
    width: 300,
    height: 50,
    borderRadius: 15,
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#373737",
    marginBottom: 50,
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
    marginTop: 50,
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

  loginButton: {
    width: 126,
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
