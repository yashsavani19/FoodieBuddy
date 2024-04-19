import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_URL,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
  OPENAI_API_KEY,
  OPENAI_ORG_ID,
} from "@env";

import {
  initializeAuth,
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  signInWithCredential,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  AuthError,
} from "firebase/auth";

import { initializeApp } from "firebase/app";

import { addUserInfo, fetchUser } from "./DatabaseHandler";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { Use } from "react-native-svg";
import React, { useEffect, useState } from "react";

//Google sign in configure
// export const googleSignIn = () => {
//   useEffect(() => {
//     GoogleSignin.configure({
//       webClientId: FIREBASE_WEB_CLIENT_ID,
//     });
//   }, []);

//   const signIn = async () => {

//     // ...

//     const [state, setState] = useState({ userInfo: null });

//     // ...

//     try {
//       await GoogleSignin.hasPlayServices();
//       const userInfo = await GoogleSignin.signIn();
//       setState({ userInfo });
//     } catch (error) {
//       if (error === statusCodes.SIGN_IN_CANCELLED) {
//         // user cancelled the login flow
//       } else if (error === statusCodes.IN_PROGRESS) {
//         // operation (e.g. sign in) is in progress already
//       } else if (error === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//         // play services not available or outdated
//       } else {
//         // some other error happened
//       }
//     }
//   };
// };
/**
 * Firebase configuration
 */
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_APP_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

const provider = new GoogleAuthProvider();

const app = initializeApp(firebaseConfig);

// Handlers

//Handle login
export const handleLogin = async (
  email: string,
  password: string
): Promise<void> => {
  // Validate input fields
  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  try {
    // Attempt to login
    await login(email, password);
    alert("Login successful!");
  } catch (error: any) {
    // Cast the error to AuthError to access the code and message properties
    const authError = error as AuthError;

    // Handle specific errors based on the error code
    switch (authError.code) {
      case "auth/user-not-found":
        alert("No user found with this email.");
        break;
      case "auth/wrong-password":
        alert("Incorrect password. Please try again.");
        break;
      case "auth/too-many-requests":
        alert("Too many unsuccessful login attempts. Please try again later.");
        break;
      case "auth/invalid-email":
        alert("The email address is not valid.");
        break;
      case "auth/invalid-credential":
        alert("The email or password is incorrect.");
        break;
      default:
        alert(`Login failed: ${authError.message}`);
        break;
    }
  }
};

//Handle Register
export const handleRegister = async (
  email: string,
  username: string,
  password: string,
  confirmPassword: string
): Promise<void> => {
  // Alert Message if any of the fields is empty
  if (!email || !username || !password || !confirmPassword) {
    alert("Please fill in all fields");
    return;
  }

  // Alert message for passwords don't match
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    await register(email, password);
    alert("Registration successful");
  } catch (error: any) {
    const authError = error as AuthError;
    console.error(authError.code);
    switch (authError.code) {
      //Special error cases being thrown by firebase
      case "auth/email-already-in-use":
        alert(`Email address already in use.`);
        break;
      case "auth/invalid-email":
        alert(`Email address is invalid.`);
        break;
      case "auth/operation-not-allowed":
        alert("Error during registration: Operation not allowed.");
        break;
      case "auth/weak-password.":
        console.log("Password is too weak!!");
        alert("Password is too weak.");
        break;
      default:
        alert(`Registration failed: ${authError.message}`);
        break;
    }
  }
};

//Handle Reset Password
export const handleResetPassword = async (email: string): Promise<void> => {
  // Check if the email is not empty
  if (email.replaceAll(" ", "").length === 0) {
    alert("Please enter your email address.");
    return;
  }

  try {
    // Attempt to send a password reset email
    await resetPassword(email);
    alert("Password reset email sent. Please check your inbox.");
  } catch (error: any) {
    // Handle different types of errors here
    const authError = error as AuthError; // Assuming AuthError is the type imported from 'firebase/auth'
    switch (authError.code) {
      case "auth/invalid-email":
        alert("Please enter a valid email address.");
        break;
      default:
        alert(`Failed to send password reset email: ${authError.message}`);
        break;
    }
  }
};

//Handle Logout
export const handleLogout = () => {
  logout();
  console.log("User logged out");
};

// Methods

//login
const login = async (email: string, password: string): Promise<void> => {
  const auth = getAuth(app);
  await signInWithEmailAndPassword(auth, email, password);
};

//Login with Google

//Register
const register = async (email: string, password: string): Promise<void> => {
  const auth = getAuth(app);
  await createUserWithEmailAndPassword(auth, email, password);
};

//Authenticate by sending email link

//Logout
const logout = async () => {
  try {
    const response = await signOut(getAuth());
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

//Reset Password
const resetPassword = async (email: string) => {
  const auth = getAuth();
  await sendPasswordResetEmail(auth, email);
};

//CODE USED FROM FIREBASE DOCUMENTATION
export const loginWithGoogle = async () => {
  // // First, get the Google sign-in result
  // const { idToken } = await GoogleSignin.signIn();
  // // Then, create a Google credential with the token
  // const googleCredential = GoogleAuthProvider.credential(idToken);
  // // Finally, sign in with Firebase using the Google credential
  // const signInResult = await signInWithCredential(getAuth(), googleCredential);
  // // Now you have access to the Google access token if you need it
  // const token = idToken;
  // // The signed-in user info
  // const user = signInResult.user;
  // console.log(user.displayName);
  // signInWithPopup(auth, provider)
  // .then((result: any) => {
  //   // This gives you a Google Access Token. You can use it to access the Google API.
  //   const credential = GoogleAuthProvider.credentialFromResult(result);
  //   const token = credential?.accessToken;
  //   // The signed-in user info.
  //   const user = result.user;
  //   // IdP data available using getAdditionalUserInfo(result)
  //   //ADDED BY ME
  // //   const userData = result.additionalUserInfo?.profile;
  //    console.log(""+user.displayName);
  //   // ...
  // })
  // .catch((error: any) => {
  //   // Handle Errors here.
  //   const errorCode = error.code;
  //   const errorMessage = error.message;
  //   // The email of the user's account used.
  //   const email = error.customData.email;
  //   // The AuthCredential type that was used.
  //   const credential = GoogleAuthProvider.credentialFromError(error);
  //   // ...
  // });
};
