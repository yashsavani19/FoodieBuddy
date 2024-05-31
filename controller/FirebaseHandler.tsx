import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_URL,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
} from "@env";

import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  AuthError,
  onAuthStateChanged,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";

import { getDatabase } from "firebase/database";

import { initializeApp } from "firebase/app";

import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

import React, { useEffect, useState } from "react";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase configuration
 */
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  projectId: FIREBASE_PROJECT_URL,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

const provider = new GoogleAuthProvider();

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
// export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtDb = getDatabase(app);

export const useIsAuthenticated = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    // Cleanup the subscription
    return unsubscribe;
  }, []);

  return isAuthenticated;
};

// Handlers

// Handle login
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

// Handle register
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
      // Special error cases being thrown by firebase
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

// Handle reset password
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

// Handle logout
export const handleLogout = () => {
  try {
    logout();
    alert("Logout successful!");
  } catch (error: any) {
    alert(`Logout failed: ${error.message}`);
  }
};

// Methods
// Login
const login = async (email: string, password: string): Promise<void> => {
  await signInWithEmailAndPassword(auth, email, password);
};

// Register
const register = async (email: string, password: string): Promise<void> => {
  await createUserWithEmailAndPassword(auth, email, password);
};

// Logout
const logout = async (): Promise<void> => {
  await signOut(auth);
};

// Reset password
const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};
