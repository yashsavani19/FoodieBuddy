import { useNavigationContainerRef, useRouter, useSegments } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import * as Auth from "firebase/auth";
import { auth } from "../controller/FirebaseHandler";
import {
  addUsername,
  checkUsername,
  updateUsername,
} from "@/controller/DatabaseHandler";

/**
 * Represents the response of a sign-in operation.
 */
interface SignInResponse {
  data: Auth.User | undefined;
  error: any;
}

/**
 * Represents the response of a sign-out operation.
 */
interface SignOutResponse {
  error: any;
  data: {} | undefined;
}

/**
 * Represents the value provided by the AuthContext.
 */
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

/**
 * Represents the props for the AuthProvider component.
 */
interface ProviderProps {
  children: React.ReactNode;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);

/**
 * AuthProvider component that provides authentication-related functionality.
 */
export function AuthProvider(props: ProviderProps) {
  const [user, setAuthUser] = useState<Auth.User | null>(
    auth.currentUser || null
  );
  const [authInitialised, setAuthInitialised] = useState(false);

  /**
   * Custom hook to handle protected routes based on authentication status.
   */
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
        router.push("/(tabs)/RestaurantListViews/ListView");
      }
    }, [user, authInitialised, isNavigationReady]);
  };

  /**
   * Effect to initialize authentication state.
   */
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
   * Handles the login operation.
   * @param email - User's email address.
   * @param password - User's password.
   * @returns Promise resolving to a boolean indicating success.
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

  /**
   * Handles authentication errors.
   * @param error - Authentication error.
   */
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

  /**
   * Performs the login operation with Firebase.
   * @param email - User's email address.
   * @param password - User's password.
   */
  const login = async (email: string, password: string): Promise<void> => {
    await Auth.signInWithEmailAndPassword(auth, email, password);
  };

  /**
   * Handles the registration operation.
   * @param email - User's email address.
   * @param username - User's username.
   * @param password - User's password.
   * @param confirmPassword - User's password confirmation.
   * @returns Promise resolving to a boolean indicating success.
   */
  const handleRegister = async (
    email: string,
    username: string,
    password: string,
    confirmPassword: string
  ): Promise<boolean> => {
    if (!email || !username || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return false;
    }

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

  /**
   * Registers a new user with Firebase.
   * @param email - User's email address.
   * @param password - User's password.
   * @param username - User's username.
   * @returns Promise resolving to a boolean indicating success.
   */
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
    return true;
  };

  /**
   * Handles the logout operation.
   */
  const handleLogout = async () => {
    try {
      await logout();
      setAuthUser(null);
    } catch (error: any) {
      alert(`Logout failed: ${error.message}`);
    }
  };

  /**
   * Performs the logout operation with Firebase.
   */
  const logout = async (): Promise<void> => {
    await Auth.signOut(auth);
  };

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

/**
 * Re-authenticates the current user with Firebase.
 * @param password - User's password.
 * @returns Promise resolving to a boolean indicating success.
 */
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

/**
 * Changes the username of the current user.
 * @param newUsername - The new username.
 * @param profileImageUrl - URL of the profile image.
 * @returns Promise resolving to a boolean indicating success.
 */
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

/**
 * Changes the email of the current user.
 * @param newEmail - The new email address.
 * @returns Promise resolving to a boolean indicating success.
 */
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
};

/**
 * Changes the password of the current user.
 * @param newPassword - The new password.
 * @returns Promise resolving to a boolean indicating success.
 */
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

/**
 * Custom hook to use the AuthContext.
 * @returns AuthContext value.
 * @throws Error if used outside of AuthProvider.
 */
export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return authContext;
};
