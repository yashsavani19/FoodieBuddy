import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_URL,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
  FIREBASE_WEB_CLIENT_ID,
  FIREBASE_WEB_CLIENT_SECRET,
  OPENAI_API_KEY,
  OPENAI_ORG_ID,
} from "@env";

import { initializeApp } from "firebase/app";
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
} from "firebase/auth";

import { addUserInfo, fetchUser } from "./DatabaseHandler";

// import { GoogleSignin } from "@react-native-google-signin/google-signin";

// //Google sign in configure
// GoogleSignin.configure({
//   webClientId: FIREBASE_WEB_CLIENT_ID,
// });

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

// Handlers

//Handle login
export const handleLogin = (email: string, password: string) => {
  console.log("Email: ", email);
  console.log("Password: ", password);
  login(email, password)
    .then(() => {
      console.log("User logged in with Google");
      fetchUser();
    })
    .catch((error) => {
      console.log("Google login failed:", error);
    });

    
};

//Handle Register
export const handleRegister = (
  email: string,
  username: string,
  password: string,
  confirmPassword: string
) => {
  console.log("Email: ", email);
  console.log("Password: ", password);
  console.log(
    "Username: ",
    username
  );
  console.log("Confirm Password: ", confirmPassword);
  
  register(email, username, password, confirmPassword);
  addUserInfo(email, username);
  
};

//Handle Reset Password
export const handleResetPassword = (email: string) => {
  console.log("Email: ", email);
  resetPassword(email);
  console.log("Password reset email sent");
};
//Handle Logout
export const handleLogout = () => {
  logout();
  console.log("User logged out");
}
// Methods

//login
export const login = async (email: string, password: string) => {
  try {
    const response = await signInWithEmailAndPassword(
      getAuth(),
      email,
      password
    );
    // Handle successful login
    console.log("User logged in:");

    return true;
  } catch (error) {
    // Handle login error
    console.error("Login failed:", error);
  }
};

//Login with Google

//Register
const register = async (
  email: string,
  username: string,
  password: string,
  confirmPassword: string
) => {
  try {
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
      return false;
    }
    const response = await createUserWithEmailAndPassword(
      getAuth(),
      email,
      password
    );
    // Handle successful registration
    
    console.log("User registered:", response.user);

    return true;
  } catch (error) {
    // Handle registration error
    if (error === "auth/email-already-in-use") {

      console.log("That email address is already in use!");
      login(email, password);
    }

    if (error === "auth/invalid-email") {
      console.log("That email address is invalid!");
    } else {
      console.error("Registration failed:", error);
    }

    return false;
  }
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
  try {
    const response = await sendPasswordResetEmail(getAuth(), email);
    // Handle successful password reset
    console.log("Password reset email sent");
  } catch (error) {
    // Handle password reset error
    console.error("Password reset failed:", error);
  }
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

// export const app = initializeApp(firebaseConfig);
// export const auth = initializeAuth(app);
