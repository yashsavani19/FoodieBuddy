import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
} from "@env";

import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth, signInWithEmailAndPassword } from "firebase/auth";

/**
 * Firebase configuration
 */
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

// //login
// export const login = async (email: string, password: string) => {
//     try {
//         const response = await signInWithEmailAndPassword(email, password);
//         // Handle successful login
//         console.log("User logged in:", response.user);
//     } catch (error) {
//         // Handle login error
//         console.error("Login failed:", error);
//     }
// };

// //login with google
// // const loginWithGoogle = async () => {
// //     try {
// //         const provider = firebase.auth.GoogleAuthProvider(); // Replace this line
// //         const response = await firebase.auth().signInWithPopup(provider);
// //         // Handle successful login with Google
// //         console.log("User logged in with Google:", response.user);
// //     } catch (error) {
// //         // Handle login with Google error
// //         console.error("Login with Google failed:", error);
// //     }
// // };



// //authentication
// export const authenticate = async (email: string, password: string) => {
//     try {
//         const response = await firebaseAuth().signInWithEmailAndPassword(email, password);
//         // Handle successful authentication
//         console.log("User authenticated:", response.user);
//     } catch (error) {
//         // Handle authentication error
//         console.error("Authentication failed:", error);
//     }
// };

// //logout

// export const logout = async () => {
//     try {
//         await signOut();
//         // Handle successful logout
//         console.log("User logged out");
//     } catch (error) {
//         // Handle logout error
//         console.error("Logout failed:", error);
//     }
// };
// //register
// // register with google
// export const register = async (email: string, username: string, password: string, confirmPassword: string) => {
//     try {
//         if (password !== confirmPassword) {
//             throw new Error("Passwords do not match");
//         }
//         const response = await firebase.auth().createUserWithEmailAndPassword(email, password);
//         // Handle successful registration
//         console.log("User registered:", response.user);
//     } catch (error) {
//         // Handle registration error
//         console.error("Registration failed:", error);
//     }
// };

// // register with Google
// // export const registerWithGoogle = async () => {
// //     try {
// //         const provider =  firebase.auth().GoogleAuthProvider();
// //         const response = await firebase.auth().signInWithPopup(provider);
// //         // Handle successful registration with Google
// //         console.log("User registered with Google:", response.user);
// //     } catch (error) {
// //         // Handle registration with Google error
// //         console.error("Registration with Google failed:", error);
// //     }
// // };


// //reset password

// //logout

// //register

// //reset password




export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app);