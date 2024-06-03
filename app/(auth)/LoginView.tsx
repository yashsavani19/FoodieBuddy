import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  BackHandler,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

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
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    const result = await signIn(email, password);
    if (!result) {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                >
                  {!loading ? (
                    <Text style={styles.loginButtonText}> Login </Text>
                  ) : (
                    <ActivityIndicator
                      size="large"
                      color="#fff"
                      animating={loading}
                      style={{ marginTop: 10 }}
                    />
                  )}
                </TouchableOpacity>
              </View>
              {/* Forgot Password Link */}
              <Link href={"/ResetPasswordView"}>
                <Text style={styles.clickableText}> Forgot Password? </Text>
              </Link>
              {/* Create Account Button*/}
              <View style={styles.createAccountContainer}>
                <Text style={styles.textStyle}>
                  Don't Have an Account yet?{" "}
                </Text>
                <Link href={"/RegisterView"}>
                  <Text style={styles.clickableText}> Register Now! </Text>
                </Link>
              </View>
            </SafeAreaView>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f26722",
    flex: 1,
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    marginTop: hp("7%"),
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f26722",
  },
  inputContainer: {
    width: wp("80%"),
    height: hp("7%"),
    borderRadius: 15,
    margin: wp("2.5%"),
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: hp("7%"),
    borderColor: "transparent",
    borderWidth: 1,
  },
  inputLogo: {
    width: wp("7.5%"),
    height: hp("4.5%"),
    resizeMode: "contain",
    margin: wp("3.5%"),
  },
  logo: {
    width: wp("80%"),
    height: hp("25%"),
    marginTop: hp("10%"),
    resizeMode: "contain",
  },
  buttonContainer: {
    backgroundColor: "#f26722",
  },
  loginButton: {
    width: wp("35%"),
    borderRadius: 15,
    backgroundColor: "#3464AC",
    marginTop: hp("3%"),
    marginBottom: hp("2%"),
    height: hp("6%"),
    justifyContent: "center",
  },
  loginButtonText: {
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
  createAccountContainer: {
    backgroundColor: "#f26722",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: wp("2.5%"),
    margin: wp("2.5%"),
  },
});
