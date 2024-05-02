import { useNavigationContainerRef, useRouter, useSegments } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import * as Auth from "firebase/auth";
import { auth } from "../controller/FirebaseHandler";
import { addUser } from "@/controller/DatabaseHandler";

interface SignInResponse {
  data: Auth.User | undefined;
  error: any;
}

interface SignOutResponse {
  error: any;
  data: {} | undefined;
}

interface AuthContextValue {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    username: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
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
    const segments = useSegments();
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
      if (!isNavigationReady) {
        return;
      }

      const inAuthGroup = segments[0] === "(auth)";
      if (!authInitialised) return;

      if (!user && !inAuthGroup) {
        router.push("/LoginView");
      } else if (user && inAuthGroup) {
        router.push("/RestaurantListViews/");
      }
    }, [user, segments, authInitialised, isNavigationReady]);
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
  ): Promise<void> => {
    setAuthInitialised(false);
    try {
      if (!email || !password) {
        alert("Please enter both email and password.");
        setAuthInitialised(true);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        setAuthInitialised(true);
        return;
      }

      await login(email, password);
      const currentUser = Auth.getAuth().currentUser;
      setAuthUser(currentUser);

    } catch (error: any) {
      handleAuthError(error);
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
      await register(email, password, username);
      alert("Registration successful");
      await handleLogin(email, password);
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
  };

  const register = async (
    email: string,
    password: string,
    username: string
  ): Promise<void> => {
    await Auth.createUserWithEmailAndPassword(auth, email, password);
    const currentAuth = Auth.getAuth();
    await addUser(Auth.getAuth().currentUser?.uid || "", email, username);
    if (currentAuth.currentUser === null) {
      alert("Error registering user");
      return;
    }
    await Auth.updateProfile(currentAuth.currentUser, {
      displayName: username,
    });
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

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return authContext;
};
