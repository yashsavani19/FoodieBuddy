import { Auth, EmailAuthCredential, EmailAuthProvider, User, deleteUser, reauthenticateWithCredential} from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "./FirebaseHandler";

/**
 * Delete user account
 * @param password - User's password for reauthentication
 */
export const deleteUserAccount = async (password: string, user : User, db: any) => {
    try {
    //   const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
  
      // Reauthenticate the user
    //   const credential = EmailAuthProvider.credential(user.email || "", password);
    //   await reauthenticateWithCredential(user, credential);
  
    //   Delete user data from Firestore
      const userDocRef = doc(db, "users", user.uid);
      await deleteDoc(userDocRef);
  
    //   Delete user-related data from other collections
    //   await deleteUserData(user.uid);
  
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
  