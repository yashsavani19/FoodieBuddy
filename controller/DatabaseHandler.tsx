import { Preference } from "@/model/Preference";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/controller/FirebaseHandler";
import { Saved } from "@/model/Saved";
import { auth } from "@/controller/FirebaseHandler";
import { Restaurant } from "@/model/Restaurant";
// import { useAuth } from "@/context/AuthContext";
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

// const preferenceCollection = `users/${useAuth().user?.uid}/preferences`;
const cleanRestaurantData = (restaurant: Restaurant): Partial<Restaurant> => {
  const cleanedData: Partial<Restaurant> = restaurant;
  if (restaurant.phone === undefined) restaurant.phone = "";
  if (restaurant.website === undefined) restaurant.website = "";
  if (restaurant.categories === undefined) restaurant.categories = [];
  if (restaurant.price === undefined) restaurant.price = "";
  if (restaurant.rating === undefined) restaurant.rating = 0;
  if (restaurant.displayAddress === undefined) restaurant.displayAddress = "";
  if (restaurant.isClosed === undefined) restaurant.isClosed = "";
  if (restaurant.isFavourite === undefined) restaurant.isFavourite = false;
  if (restaurant.isBookmarked === undefined) restaurant.isBookmarked = false;
  if (restaurant.isVisited === undefined) restaurant.isVisited = false;
  return cleanedData;
};

/**
 * Adds favourite to user's favourites
 * @param placeId Maps API place id
 */
export const addFavourite = async (restaurant: Restaurant) => {
  try {
    const uid = auth.currentUser?.uid;
    const favouriteCollection = `users/${uid}/favourites`;
    const newRestaurant = cleanRestaurantData(restaurant);
    const docRef = doc(db, favouriteCollection, restaurant.id);
    await setDoc(
      docRef,
      {
        addedOn: new Date(),
        restaurant: newRestaurant,
      },
      { merge: true }
    );
    console.log("Document written with Place ID (Favourites): ", docRef.id);
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
    const uid = auth.currentUser?.uid;
    const favouriteCollection = `users/${uid}/favourites`;
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
    const uid = auth.currentUser?.uid;
    if (!uid) {
      console.error("User not authenticated");
      alert("You must be logged in to view favourites.");
      return;
    }
    const favouriteCollection = `users/${uid}/favourites`;
    const querySnapshot = await getDocs(collection(db, favouriteCollection));
    const favourites: Saved[] = [];
    querySnapshot.forEach((doc) => {
      favourites.push({
        restaurant: doc.data().restaurant as Restaurant,
        addedOn: doc.data().addedOn as Date,
      });
    });
    // console.error("favourites", favourites);
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
export const addBookmark = async (restaurant: Restaurant) => {
  try {
    const uid = auth.currentUser?.uid;
    const bookmarkCollection = `users/${uid}/bookmarks`;
    const newRestaurant = cleanRestaurantData(restaurant);
    const docRef = doc(db, bookmarkCollection, restaurant.id);
    await setDoc(
      docRef,
      {
        restaurant: newRestaurant,
        addedOn: new Date(),
      },
      { merge: true }
    );
    console.log("Document written with Place ID (Bookmark): ", docRef.id);
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
    const uid = auth.currentUser?.uid;
    const bookmarkCollection = `users/${uid}/bookmarks`;
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
    const uid = auth.currentUser?.uid;
    if (!uid) {
      console.error("User not authenticated");
      alert("You must be logged in to view bookmarks.");
      return;
    }
    const bookmarkCollection = `users/${uid}/bookmarks`;
    const querySnapshot = await getDocs(collection(db, bookmarkCollection));
    const bookmarks: Saved[] = [];
    querySnapshot.forEach((doc) => {
      bookmarks.push({
        restaurant: doc.data().restaurant as Restaurant,
        addedOn: doc.data().addedOn as Date,
      });
    });
    return bookmarks;
  } catch (e) {
    console.error("Error getting documents: ", e);
    alert("Internal error fetching favourites. Please try again later.");
  }
};

/**
 * Adds visited to user's visited
 * @param placeId Maps API place id
 */
export const addVisited = async (restaurant: Restaurant) => {
  try {
    const uid = auth.currentUser?.uid;
    const visitedCollection = `users/${uid}/visited`;
    const newRestaurant = cleanRestaurantData(restaurant);
    const docRef = doc(db, visitedCollection, restaurant.id);
    await setDoc(
      docRef,
      {
        addedOn: new Date(),
        restaurant: newRestaurant,
      },
      { merge: true }
    );
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
    const uid = auth.currentUser?.uid;
    const visitedCollection = `users/${uid}/visited`;
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
    const uid = auth.currentUser?.uid;
    if (!uid) {
      console.error("User not authenticated");
      alert("You must be logged in to view visited restaurants.");
      return;
    }
    const visitedCollection = `users/${uid}/visited`;
    const querySnapshot = await getDocs(collection(db, visitedCollection));
    const visited: Saved[] = [];
    querySnapshot.forEach((doc) => {
      visited.push({
        restaurant: doc.data().restaurant as Restaurant,
        addedOn: doc.data().addedOn as Date,
      });
    });
    return visited;
  } catch (e) {
    console.error("Error getting documents: ", e);
    alert("Internal error fetching favourites. Please try again later.");
  }
};

/**
 * Adds user info to database on registration
 * @param uid user id
 * @param email user email
 * @param username user username
 */
export const addUser = async (uid: string, email: string, username: string) => {
  console.log("addUser", uid, email, username);
  try {
    const userCollection = `users/${uid}`;
    await setDoc(doc(db, userCollection), {
      email: email,
      username: username,
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    alert("Internal error adding user. Please try again later.");
  }
};

/**
 * Fetches user data
 */
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

// /**
//  * Updates username
//  * @param newUsername new username
//  */
// export const updateUsername = async (uid: string, newUsername: string) => {
//   try {
//     await setDoc(
//       doc(db, userCollection),
//       { username: newUsername },
//       { merge: true }
//     );
//   } catch (e) {
//     console.error("Error updating document: ", e);
//     alert("Internal error updating username. Please try again later.");
//   }
// };

// // WARNING: Currently only updates database email, not authentication email
// /**
//  * Updates user email
//  * @param newEmail new email address
//  */
// export const updateEmail = async (uid: string, newEmail: string) => {
//   try {
//     await setDoc(doc(db, userCollection), { email: newEmail }, { merge: true });
//   } catch (e) {
//     console.error("Error updating document: ", e);
//     alert("Internal error updating email. Please try again later.");
//   }
// };

// /**
//  * Updates user profile picture
//  * @param newProfilePictureUrl new profile picture URL
//  */
// export const updateProfilePicture = async (uid: string, newProfilePictureUrl: string) => {
//   try {
//     await setDoc(
//       doc(db, userCollection),
//       { profilePicture: newProfilePictureUrl },
//       { merge: true }
//     );
//   } catch (e) {
//     console.error("Error updating document: ", e);
//     alert("Internal error updating profile picture. Please try again later.");
//   }
// };

// /**
//  * Adds preference to user's preferences
//  * @param preference preference object
//  */
// export const addPreference = async (preference: Preference) => {
//   try {
//     const docRef = await addDoc(collection(db, preferenceCollection), {
//       name: preference.name,
//     });
//   } catch (e) {
//     console.error("Error adding document: ", e);
//     alert("Internal error adding preference. Please try again later.");
//   }
// };

// /**
//  * Removes preference from user's preferences
//  * @param preferenceId preference id
//  */
// export const removePreference = async (preferenceId: string) => {
//   try {
//     await deleteDoc(doc(db, preferenceCollection, preferenceId));
//   } catch (e) {
//     console.error("Error removing document: ", e);
//     alert("Internal error removing preference. Please try again later.");
//   }
// };

// /**
//  * Fetches preferences from user
//  */
// export const fetchPreferences = async () => {
//   try {
//     const querySnapshot = await getDocs(collection(db, preferenceCollection));
//     const preferences: Preference[] = [];
//     querySnapshot.forEach((doc) => {
//       preferences.push(doc.data().name);
//     });
//     return preferences;
//   } catch (e) {
//     console.error("Error getting documents: ", e);
//     alert("Internal error fetching preferences. Please try again later.");
//   }
// };
