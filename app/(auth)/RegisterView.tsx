import {
  StyleSheet,
  TextInput,
  Button,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";

const buddyLogo = require("@/assets/images/title-logo.png");

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useAuth } from "@/context/AuthContext";

export default function RegisterView() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <View style={styles.container}>
      {/* Main Inner Container that displays all the content */}
      <ScrollView>
        {/* Main Logo */}
        {/*  */}
        <Image source={buddyLogo} style={styles.logo} />
        <SafeAreaView style={styles.innerContainer}>
          {/*  */}
          {/* Google Register */}
          {/* <TouchableOpacity style={styles.googleRegisterContainer}>
          <Image
            source={require("@/assets/images/google-icon.png")}
            style={styles.inputLogo}
          />
          <Text
            style={styles.googleText}
            // onPress={}
          >
            Register With Google
          </Text>
        </TouchableOpacity> */}
          {/*  */}
          {/* Input Fields */}
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
            />
          </View>
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
          {/*  */}
          {/* Register Button */}
          <View style={styles.buttonContainer}>
            <Pressable style={styles.registerButton}>
              <Button
                title="Register"
                color="black"
                onPress={() => {
                  signUp(email, username, password, confirmPassword);
                }}
              />
            </Pressable>
            <TouchableOpacity
            // onPress={handleImageButtonPress}
            ></TouchableOpacity>
          </View>

          {/*  */}
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
    width: 100,
    borderRadius: 20,
    backgroundColor: "#3383FF",
    marginTop: 20,
    marginBottom: 15,
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
