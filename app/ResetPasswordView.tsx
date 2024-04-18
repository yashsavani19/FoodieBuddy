import {
    StyleSheet,
    TextInput,
    Button,
    SafeAreaView,
    Image,
    TouchableOpacity,
    Pressable,
  } from "react-native";
  import {
    handleLogin,
    handleRegister,
    handleResetPassword,
  } from "@/controller/FirebaseHandler";
  import React, { useState } from "react";
  
  const buddyLogo = require("@/assets/images/title-logo.png");
  
  import EditScreenInfo from "@/components/EditScreenInfo";
  import { Text, View } from "@/components/Themed";
  import { Link, Navigator } from "expo-router";
  
  export default function LoginView() {
    const [email, setEmail] = useState("");
    
    return (
      <View style={styles.container}>
        {/* Main Logo */}
        <Image source={buddyLogo} style={styles.logo} />
        {/*  */}
        {/* Main Inner Container that displays all the content */}
        <SafeAreaView style={styles.innerContainer}>
         
          {/*  */}
          {/* Input Fields */}
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
          {/*  */}
          {/* Login Button */}
          <View style={styles.buttonContainer}>
            <Pressable style={styles.loginButton}>
              <Button
                title="Send Link to Email"
                color="white"
                // onPress={handleRectangleButtonPress}
              />
            </Pressable>
            <TouchableOpacity
            // onPress={handleImageButtonPress}
            ></TouchableOpacity>
          </View>
          {/*  */}
          {/* Create Account Button*/}
          <View style={styles.createAccountContainer}>
            <Text style={styles.textStyle}>Password Reset Done?</Text>
            <Link href={"/LoginView"}>
              <Text style={styles.clickableText}> Login Again!</Text>
            </Link>
          </View>
        </SafeAreaView>
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
      height: 300,
      marginTop: 75,
      resizeMode: "contain",
    },
  
    buttonContainer: {
      backgroundColor: "#f26722",
    },
  
    loginButton: {
      width: 200,
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
  