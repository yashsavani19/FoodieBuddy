import { Preference } from "@/model/Preference";
import { collection, doc, addDoc, getDoc, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "@/services/FirestoreServices";
import { Saved } from "@/model/Saved";
/**
 * Getters and setters for user data
 * Schema:
 * users: {
 *     userId: {
 *         username: string,
 *         email: string,
 *         profilePicture: string,
 *         favourites: {
 *             placeId: {
 *                 placeId: string,
 *                 addedOn: Timestamp,
 *             },
 *         },
 *         bookmarks: {
 *             placeId: {
 *                 placeId: string,
 *                 addedOn: Timestamp,
 *             },
 *         },
 *         visited: {
 *             placeId: {
 *                 placeId: string,
 *                 addedOn: Timestamp,
 *             },
 *         },
 *         preferences: {
 *             preferenceId: {
 *                 name: string,
 *             },
 *     },
 * }
 */

const userCollection = `users/${auth.currentUser?.uid}`;
const favouriteCollection = `users/${auth.currentUser?.uid}/favourites`;
const bookmarkCollection = `users/${auth.currentUser?.uid}/bookmarks`;
const visitedCollection = `users/${auth.currentUser?.uid}/visited`;
const preferenceCollection = `users/${auth.currentUser?.uid}/preferences`;

/**
 * Adds favourite to user's favourites
 * @param placeId Maps API place id
 */
export const addFavourite = async (placeId: string) => {
  try {
    const docRef = await addDoc(collection(db, favouriteCollection), {
      placeId: placeId,
      addedOn: new Date(),
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    alert("Internal error adding favourite. Please try again later.");
  }
};

/**
 * Removes favourite from user's favourites
 * @param placeId Maps API place id
 */
export const removeFavourite = async (placeId: string) => {
  try {
    await deleteDoc(doc(db, favouriteCollection, placeId));
  } catch (e) {
    console.error("Error removing document: ", e);
    alert("Internal error removing favourite. Please try again later.");
  }
};

/**
 * Fetches favourites from user
 */
export const fetchFavourites = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, favouriteCollection));
    const favourites: Saved[] = [];
    querySnapshot.forEach((doc) => {
      favourites.push(doc.data().placeId);
    });
    return favourites;
  } catch (e) {
    console.error("Error getting documents: ", e);
    alert("Internal error fetching favourites. Please try again later.");
  }
};

/**
 * Adds bookmark to user's bookmarks
 * @param placeId Maps API place id
 */
export const addBookmark = async (placeId: string) => {
  try {
    const docRef = await addDoc(collection(db, bookmarkCollection), {
      placeId: placeId,
      addedOn: new Date(),
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    alert("Internal error adding bookmark. Please try again later.");
  }
};

/**
 * Removes bookmark from user's bookmarks
 * @param placeId Maps API place id
 */
export const removeBookmark = async (placeId: string) => {
  try {
    await deleteDoc(doc(db, bookmarkCollection, placeId));
  } catch (e) {
    console.error("Error removing document: ", e);
    alert("Internal error removing bookmark. Please try again later.");
  }
};

/**
 * Fetches bookmarks from user
 */
export const fetchBookmarks = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, bookmarkCollection));
    const bookmarks: string[] = [];
    querySnapshot.forEach((doc) => {
      bookmarks.push(doc.data().placeId);
    });
    return bookmarks;
  } catch (e) {
    console.error("Error getting documents: ", e);
    alert("Internal error fetching bookmarks. Please try again later.");
  }
};

/**
 * Adds visited to user's visited
 * @param placeId Maps API place id
 */
export const addVisited = async (placeId: string) => {
  try {
    const docRef = await addDoc(collection(db, visitedCollection), {
      placeId: placeId,
      addedOn: new Date(),
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    alert("Internal error adding visited. Please try again later.");
  }
};

/**
 * Removes visited from user's visited
 * @param placeId Maps API place id
 */
export const removeVisited = async (placeId: string) => {
  try {
    await deleteDoc(doc(db, visitedCollection, placeId));
  } catch (e) {
    console.error("Error removing document: ", e);
    alert("Internal error removing visited. Please try again later.");
  }
};

/**
 * Fetches visited from user
 */
export const fetchVisited = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, visitedCollection));
    const visited: string[] = [];
    querySnapshot.forEach((doc) => {
      visited.push(doc.data().placeId);
    });
    return visited;
  } catch (e) {
    console.error("Error getting documents: ", e);
    alert("Internal error fetching visited. Please try again later.");
  }
};

/**
 * Fetches user data
 */
export const fetchUser = async () => {
  try {
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

/**
 * Updates username
 * @param newUsername new username
 */
export const updateUsername = async (newUsername: string) => {
  try {
    await setDoc(doc(db, userCollection), { username: newUsername }, { merge: true });
  } catch (e) {
    console.error("Error updating document: ", e);
    alert("Internal error updating username. Please try again later.");
  }
};

// WARNING: Currently only updates database email, not authentication email
/**
 * Updates user email
 * @param newEmail new email address
 */
export const updateEmail = async (newEmail: string) => {
  try {
    await setDoc(doc(db, userCollection), { email: newEmail }, { merge: true });
  } catch (e) {
    console.error("Error updating document: ", e);
    alert("Internal error updating email. Please try again later.");
  }
};

/**
 * Updates user profile picture
 * @param newProfilePictureUrl new profile picture URL
 */
export const updateProfilePicture = async (newProfilePictureUrl: string) => {
  try {
    await setDoc(doc(db, userCollection), { profilePicture: newProfilePictureUrl }, { merge: true });
  } catch (e) {
    console.error("Error updating document: ", e);
    alert("Internal error updating profile picture. Please try again later.");
  }
};

/**
 * Adds preference to user's preferences
 * @param preference preference object
 */
export const addPreference = async (preference: Preference) => {
  try {
    const docRef = await addDoc(collection(db, preferenceCollection), {
      name: preference.name,
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    alert("Internal error adding preference. Please try again later.");
  }
};

/**
 * Removes preference from user's preferences
 * @param preferenceId preference id
 */
export const removePreference = async (preferenceId: string) => {
  try {
    await deleteDoc(doc(db, preferenceCollection, preferenceId));
  } catch (e) {
    console.error("Error removing document: ", e);
    alert("Internal error removing preference. Please try again later.");
  }
};

/**
 * Fetches preferences from user
 */
export const fetchPreferences = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, preferenceCollection));
    const preferences: Preference[] = [];
    querySnapshot.forEach((doc) => {
      preferences.push(doc.data().name);
    });
    return preferences;
  } catch (e) {
    console.error("Error getting documents: ", e);
    alert("Internal error fetching preferences. Please try again later.");
  }
};
