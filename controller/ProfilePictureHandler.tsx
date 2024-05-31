import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth } from "./FirebaseHandler"; // Assuming FirebaseHandler exports `db` and `auth`

// Handle uploading profile picture
export const uploadProfilePicture = async (uri: string, userId: string): Promise<string | null> => {
  try {
    const blob = await (await fetch(uri)).blob();
    const storage = getStorage();    
    const storageRef = ref(storage, `profilePictures/${userId}`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile picture: ", error);
    return null;
  }
};

// Update Firestore with profile picture URL
export const updateProfilePicture = async (
  userId: string,
  profileImageUrl: string
) => {
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

// Function to fetch user profile from Firestore
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
