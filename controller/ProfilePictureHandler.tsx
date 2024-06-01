import { getStorage, ref, deleteObject, getDownloadURL, uploadBytes } from "firebase/storage";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";

const storage = getStorage();
const db = getFirestore();

//Upload profile picture to Firebase Storage
export const uploadProfilePicture = async (uri: string, userId: string): Promise<string | null> => {
  try {
    const blob = await (await fetch(uri)).blob();
    const storageRef = ref(storage, `profilePictures/${userId}`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile picture: ", error);
    return null;
  }
};

//Update profile picture URL in Firestore
export const updateProfilePicture = async (userId: string, profileImageUrl: string) => {
  try {
    const userCollection = `users/${userId}`;
    await setDoc(
      doc(db, userCollection),
      { profileImageUrl: profileImageUrl },
      { merge: true }
    );
    const user = await fetchUser(userId);
    if (user) {
      const usernameCollection = `usernames/${user.username}`;
      await setDoc(
        doc(db, usernameCollection),
        { profileImageUrl: profileImageUrl },
        { merge: true }
      );
    }
    console.log("Profile picture URL updated successfully");
  } catch (error) {
    console.error("Error updating profile picture URL: ", error);
  }
};

//Fetch user from Firestore
export const fetchUser = async (uid: string) => {
  try {
    const userCollection = `users/${uid}`;
    const docRef = doc(db, userCollection);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.error("No such document!");
      alert("User not found.");
    }
  } catch (e) {
    console.error("Error getting document: ", e);
    alert("Internal error fetching user. Please try again later.");
  }
};

// delete profile picture from UserProfile
export const deleteProfilePicture = async (userId: string) => {
  try {
    const storageRef = ref(storage, `profilePictures/${userId}`);
    await deleteObject(storageRef);
    const userCollection = `users/${userId}`;
    await setDoc(
      doc(db, userCollection),
      { profileImageUrl: "" },
      { merge: true }
    );
    const user = await fetchUser(userId);
    if (user) {
      const usernameCollection = `usernames/${user.username}`;
      await setDoc(
        doc(db, usernameCollection),
        { profileImageUrl: "" },
        { merge: true }
      );
    }
    console.log("Profile picture deleted successfully");
  } catch (error) {
    console.error("Error deleting profile picture: ", error);
  }
};
