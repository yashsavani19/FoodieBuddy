import { useNavigationContainerRef, useRouter, useSegments } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import * as Auth from "firebase/auth";
import { auth } from "../controller/FirebaseHandler";
import {
  addUser,
  addUsername,
  checkUsername,
  updateUsername,
  addPreferences,
} from "@/controller/DatabaseHandler";

interface SignInResponse {
  data: Auth.User | undefined;
  error: any;
}

interface SignOutResponse {
  error: any;
  data: {} | undefined;
}

interface AuthContextValue {
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (
    email: string,
    username: string,
    password: string,
    confirmPassword: string
  ) => Promise<boolean>;
  signOut: () => void;
  user: Auth.User | null;
  authInitialised: boolean;
}

interface ProviderProps {
  children: React.ReactNode;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider(props: ProviderProps) {
  const [user, setAuthUser] = useState<Auth.User | null>(
    auth.currentUser || null
  );
  const [authInitialised, setAuthInitialised] = useState(false);

  const useProtectedRoute = (user: Auth.User | null) => {
    const router = useRouter();
    const [isNavigationReady, setIsNavigationReady] = useState(false);
    const rootNavigation = useNavigationContainerRef();

    useEffect(() => {
      const unsubscribe = rootNavigation?.addListener("state", (event) => {
        setIsNavigationReady(true);
      });
      return function cleanup() {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }, [rootNavigation]);

    useEffect(() => {
      if (!isNavigationReady || !authInitialised) {
        return;
      }

      if (!user) {
        router.replace("/LoginView");
      } else if (user) {
        
        console.log("User is logged in");
        try {
          console.log("Preferences added");
        } catch (error) {
          console.error("Error adding preferences: ", error);
        }
        router.push("/(tabs)/RestaurantListViews/ListView");
      }
    }, [user, authInitialised, isNavigationReady]);
  };

  useEffect(() => {
    (async () => {
      try {
        const user = Auth.getAuth().currentUser;
        console.log("User: ", user);
        setAuthUser(user);
      } catch (error) {
        console.error("Error getting user: ", error);
        setAuthUser(null);
      }
      setAuthInitialised(true);
      console.log("Auth initialised", user);
    })();
  }, []);

  /**
   * Firebase methods
   */

  const handleLogin = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    setAuthInitialised(false);
    try {
      if (!email || !password) {
        alert("Please enter both email and password.");
        setAuthInitialised(true);
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        setAuthInitialised(true);
        return false;
      }

      await login(email, password);
      const currentUser = Auth.getAuth().currentUser;
      setAuthUser(currentUser);
      return true;
    } catch (error: any) {
      handleAuthError(error);
      return false;
    } finally {
      setAuthInitialised(true);
    }
  };

  const handleAuthError = (error: Auth.AuthError) => {
    switch (error.code) {
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
        alert(`Login failed: ${error.message}`);
        break;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    await Auth.signInWithEmailAndPassword(auth, email, password);
  };

  //Handle Register
  const handleRegister = async (
    email: string,
    username: string,
    password: string,
    confirmPassword: string
  ): Promise<boolean> => {
    // Alert Message if any of the fields is empty
    if (!email || !username || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return false;
    }

    // Alert message for passwords don't match
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return false;
    }

    try {
      const registerResult = await register(email, password, username);
      if (registerResult) {
        alert("Registration successful");
        await addUsername(username, Auth.getAuth().currentUser?.uid || "");
        await handleLogin(email, password);
        return true;
      }
    } catch (error: any) {
      const authError = error as Auth.AuthError;
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
    return false;
  };

  // Register a user
  const register = async (
    email: string,
    password: string,
    username: string
  ): Promise<boolean> => {
    const result = await checkUsername(username);
    if (result) {
      alert("Username already exists");
      return false;
    }
    await Auth.createUserWithEmailAndPassword(auth, email, password);
    const currentAuth = Auth.getAuth();
    if (currentAuth.currentUser !== null) {
      await Auth.sendEmailVerification(currentAuth.currentUser);
    }
    if (currentAuth.currentUser === null) {
      alert("Error registering user");
      return false;
    }
    await Auth.updateProfile(currentAuth.currentUser, {
      displayName: username,
    });
  
    // Add user to Firestore and add default preferences
    await addUser(currentAuth.currentUser.uid, email, username);
    // await addPreferences(currentAuth.currentUser.uid); // Ensure this is done
  
    return true;
  };

  // logout
  const handleLogout = async () => {
    try {
      await logout();
      setAuthUser(null);
      // alert("Logout successful!");
    } catch (error: any) {
      alert(`Logout failed: ${error.message}`);
    }
  };

  const logout = async (): Promise<void> => {
    await Auth.signOut(auth);
  };

  /**
   *
   */

  useProtectedRoute(user);

  return (
    <AuthContext.Provider
      value={{
        signIn: handleLogin,
        signUp: handleRegister,
        signOut: handleLogout,
        user,
        authInitialised,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export const reSignIn = async (password: string): Promise<boolean> => {
  try {
    const user = Auth.getAuth().currentUser;
    if (user) {
      if (user.email === null) return false;
      await Auth.reauthenticateWithCredential(
        user,
        Auth.EmailAuthProvider.credential(user.email, password)
      );
      return true;
    }
  } catch (error) {
    const authError = error as Auth.AuthError;
    switch (authError.code) {
      //Special error cases being thrown by firebase
      case "auth/invalid-credential":
        alert("Wrong password.");
        break;
      default:
        alert(`Reauth failed: ${authError.message}`);
        break;
    }
    return false;
  }
  return false;
};

export const changeUsername = async (
  newUsername: string,
  profileImageUrl: string
): Promise<boolean> => {
  try {
    const user = Auth.getAuth().currentUser;
    if (user) {
      const result = await updateUsername(
        newUsername,
        user.uid,
        profileImageUrl
      );
      console.log("changeUsername result: ", result);
      if (result) {
        await Auth.updateProfile(user, { displayName: newUsername });
        console.log("Username updated successfully");
        return true;
      }
    }
  } catch (error) {
    console.error("Error updating username: ", error);
  }
  return false;
};

export const changeEmail = async (newEmail: string): Promise<boolean> => {
  try {
    const user = Auth.getAuth().currentUser;
    if (user) {
      await Auth.verifyBeforeUpdateEmail(user, newEmail);
    }
    return true;
  } catch (error) {
    const authError = error as Auth.AuthError;
    console.error("Error updating email: ", error);
    switch (authError.code) {
      //Special error cases being thrown by firebase
      case "auth/email-already-in-use":
        alert(`Email address already in use.`);
        break;
      case "auth/invalid-email":
        alert(`Email address is invalid.`);
        break;
      case "auth/operation-not-allowed":
        alert("Error during update: Operation not allowed.");
        break;
      default:
        alert(`Update failed: ${authError.message}`);
        break;
    }
    return false;
  }
  // alert(
  //   "Email updated successfully, please verify your email address and login again for changes to take effect."
  // );
};

export const changePassword = async (newPassword: string): Promise<boolean> => {
  try {
    const user = Auth.getAuth().currentUser;
    if (user) {
      await Auth.updatePassword(user, newPassword);
    }
    return true;
  } catch (error: any) {
    const authError = error as Auth.AuthError;
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
        alert(`Change password failed: ${authError.message}`);
        break;
    }
  }
  return false;
};

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return authContext;
};
