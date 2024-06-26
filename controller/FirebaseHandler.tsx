import {
  signInWithEmailAndPassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
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

import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";

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

// Initialize Firebase app
export const app = initializeApp(firebaseConfig);

// Initialize Firebase authentication with persistent storage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);
export const rtDb = getDatabase(app);

/**
 * Custom hook to check if user is authenticated
 * @returns boolean indicating if user is authenticated
 */
export const useIsAuthenticated = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return unsubscribe;
  }, []);

  return isAuthenticated;
};

// Handlers

/**
 * Handle login with email and password
 * @param email - User's email
 * @param password - User's password
 */
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

/**
 * Handle user registration
 * @param email - User's email
 * @param username - User's chosen username
 * @param password - User's password
 * @param confirmPassword - User's confirmed password
 */
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

/**
 * Handle password reset
 * @param email - User's email
 */
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

/**
 * Handle user logout
 */
export const handleLogout = () => {
  try {
    logout();
    alert("Logout successful!");
  } catch (error: any) {
    alert(`Logout failed: ${error.message}`);
  }
};

/**
 * Delete user account
 * @param password - User's password for reauthentication
 */
export const deleteUserAccount = async (password: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    // Reauthenticate the user
    const credential = EmailAuthProvider.credential(user.email || "", password);
    await reauthenticateWithCredential(user, credential);

    // Delete user data from Firestore
    const userDocRef = doc(db, "users", user.uid);
    await deleteDoc(userDocRef);

    // Delete user-related data from other collections
    await deleteUserData(user.uid);

    // Delete the user
    await deleteUser(user);
  } catch (error) {
    console.error("Error deleting user account: ", error);
    throw error;
  }
};


/**
 * Delete user data from database
 * @param uid - User's UID
 */
export const deleteUserData = async (uid: string) => {
  if (auth.currentUser) {
    try {
      const userCollection = `users/${uid}`;
      await deleteDoc(doc(db, userCollection));
      const usernameCollection = `usernames`;
      const username = auth.currentUser.displayName;
      if (username) {
        await deleteDoc(doc(db, usernameCollection, username));
      }
      console.log("User data deleted with ID: ", uid);
    } catch (e) {
      console.error("Error deleting user data: ", e);
      alert("Internal error deleting user data. Please try again later.");
    }
  }
};


/**
 * Login user with email and password
 * @param email - User's email
 * @param password - User's password
 */
const login = async (email: string, password: string): Promise<void> => {
  await signInWithEmailAndPassword(auth, email, password);
};

/**
 * Register user with email and password
 * @param email - User's email
 * @param password - User's password
 */
const register = async (email: string, password: string): Promise<void> => {
  await createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Logout current user
 */
const logout = async (): Promise<void> => {
  await signOut(auth);
};

/**
 * Send password reset email
 * @param email - User's email
 */
const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};
