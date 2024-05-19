import { Preference } from "@/model/Preference";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  where,
  query,
} from "firebase/firestore";
import { db } from "@/controller/FirebaseHandler";
import { Saved } from "@/model/Saved";
import { auth } from "@/controller/FirebaseHandler";
import { Restaurant } from "@/model/Restaurant";
import { Friend } from "@/model/Friend";
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
 * Fetches user data from database
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

/**
 * Checks usernames collection for existing username
 */
export const checkUsername = async (username: string): Promise<boolean> => {
  try {
    const usernameDocRef = doc(db, "usernames", username);
    const docSnapshot = await getDoc(usernameDocRef);
    return docSnapshot.exists();
  } catch (e) {
    console.error("Error getting document: ", e);
    alert("Internal error checking username. Please try again later.");
  }
  return false;
};

/**
 * Adds username and ID to username collection
 */
export const addUsername = async (
  username: string,
  uid: string,
  profileImageUrl?: string
): Promise<boolean> => {
  try {
    const result = await checkUsername(username);

    if (result) {
      alert("Username already exists. Please choose a different one.");
      return false;
    }

    await setDoc(doc(db, "usernames", username), {
      uid: uid,
      profileImageUrl: profileImageUrl,
    });
    return true;
  } catch (e) {
    console.error("Error adding document: ", e);
    alert("Internal error adding username. Please try again later.");
  }
  return false;
};

/**
 * Deletes username based on UID and creates updated username in username collection
 */
export const updateUsername = async (
  username: string,
  uid: string,
  profileImageUrl?: string
): Promise<boolean> => {
  try {
    const usernameCollection = `usernames`;
    const currentUsername = auth.currentUser?.displayName;
    if (currentUsername) {
      const result = await addUsername(
        username,
        uid,
        profileImageUrl ||
          "https://firebasestorage.googleapis.com/v0/b/foodie-buddy-418307.appspot.com/o/user-icon.png?alt=media&token=9003ba31-6b47-4f58-b98a-fc3c82e8d537"
      );
      console.log("updateUsername result: ", result);
      if (result) {
        await deleteDoc(doc(db, usernameCollection, currentUsername));
        return true;
      }
    }
  } catch (e) {
    console.error("Error updating document: ", e);
    alert("Internal error updating username. Please try again later.");
  }
  return false;
};

/**
 * Searches for friends based on username
 * @param username username to search for
 * @returns array of username IDs
 */
export const searchUsername = async (
  username: string,
  userUid: string
): Promise<Friend | null> => {
  try {
    const usernameCollection = "usernames";
    const docRef = doc(db, usernameCollection, username);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // if (docSnap.data().uid === userUid) {
      //   console.log("You cannot add yourself as a friend :(");
      //   return null;
      // }
      const found = {
        username: username,
        uid: docSnap.data().uid,
        profileImageUrl: docSnap.data().profileImageUrl,
      } as Friend;
      return found;
    } else {
      console.log("No matching username.");
      return null;
    }
  } catch (e) {
    console.error("Error getting documents: ", e);
    alert("Internal error searching friends. Please try again later.");
  }
  return null;
};

/**
 * Get username from uid
 */
export const getUsername = async (uid: string): Promise<string> => {
  try {
    const usernameCollection = "usernames";
    const querySnapshot = await getDocs(
      query(collection(db, usernameCollection), where("uid", "==", uid))
    );
    let username = "";
    querySnapshot.forEach((doc) => {
      username = doc.id;
    });
    return username;
  } catch (e) {
    console.error("Error getting documents: ", e);
    alert("Internal error getting username. Please try again later.");
  }
  return "";
};

/**
 * Get users profile image from uid
 */
export const getProfileImageUrl = async (uid: string): Promise<string> => {
  try {
    const usernameCollection = "usernames";
    const querySnapshot = await getDocs(
      query(collection(db, usernameCollection), where("uid", "==", uid))
    );
    let profileImageUrl = "";
    querySnapshot.forEach((doc) => {
      profileImageUrl = doc.data().profileImageUrl;
    });
    return profileImageUrl;
  } catch (e) {
    console.error("Error getting documents: ", e);
    alert("Internal error getting profile image. Please try again later.");
  }
  return "";
};

/**
 * Get friends from user's friends
 */
export const fetchFriends = async (): Promise<Friend[]> => {
  try {
    const uid = auth.currentUser?.uid;
    const friendCollection = `users/${uid}/friends`;
    const querySnapshot = await getDocs(collection(db, friendCollection));
    const friends: Friend[] = [];
    querySnapshot.forEach(async (doc) => {
      const username = await getUsername(doc.id);
      const profileImageUrl = await getProfileImageUrl(doc.id);
      friends.push({
        uid: doc.data().uid,
        username: username,
        profileImageUrl: profileImageUrl,
      });
    });
    return friends;
  } catch (e) {
    console.error("Error getting documents: ", e);
    alert("Internal error fetching friends. Please try again later.");
  }
  return [];
};

/**
 * Adds friend to user's friends
 */
export const addFriend = async (friend: Friend) => {
  try {
    const uid = auth.currentUser?.uid;
    const friendCollection = `users/${uid}/friends`;
    const docRef = doc(db, friendCollection, friend.uid);
    await setDoc(docRef, {
      adddeOn: new Date(),
    });
    console.log("Added new friend: ", friend.username);
  } catch (e) {
    console.error("Error adding document: ", e);
    alert("Internal error adding friend. Please try again later.");
  }
};

/**
 * Removes friend from user's friends
 */
export const removeFriend = async (friend: Friend) => {
  try {
    const uid = auth.currentUser?.uid;
    const friendCollection = `users/${uid}/friends`;
    await deleteDoc(doc(db, friendCollection, friend.uid));
  } catch (e) {
    console.error("Error removing document: ", e);
    alert("Internal error removing friend. Please try again later.");
  }
};
