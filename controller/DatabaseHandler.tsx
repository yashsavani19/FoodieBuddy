import { Preference } from "@/model/Preference";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  where,
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
  uid: string
): Promise<boolean> => {
  try {
    const result = await checkUsername(username);

    if (result) {
      alert("Username already exists. Please choose a different one.");
      return false;
    }

    await setDoc(doc(db, "usernames", username), {
      uid: uid,
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
  uid: string
): Promise<boolean> => {
  try {
    const usernameCollection = `usernames`;
    const currentUsername = auth.currentUser?.displayName;
    if (currentUsername) {
      const result = await addUsername(username, uid);
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
 * Fetches all usernames from the usernames collection
 * @returns an array of usernames
 */
export const fetchAllUsernames = async (): Promise<string[]> => {
  try {
    const usernameCollection = collection(db, "usernames");
    const querySnapshot = await getDocs(usernameCollection);
    const usernames: string[] = [];
    querySnapshot.forEach((doc) => {
      usernames.push(doc.id); // The document ID is the username
    });
    return usernames;
  } catch (e) {
    console.error("Error fetching usernames: ", e);
    alert("Internal error fetching usernames. Please try again later.");
    return [];
  }
};

/**
 * Creates a new chat room
 * @param {string} roomName - The name of the chat room
 * @param {string} type - The type of chat room (e.g., 'buddy', 'friends')
 * @param {string} profileImageUrl - The image URL for the chat room (default is a placeholder image)
 * @returns {Promise<void>}
 */
export const createChatRoom = async (roomName: string, type: string, profileImageUrl: string = 'https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg') => {
  try {
    const docRef = await addDoc(collection(db, 'chatRooms'), {
      name: roomName,
      type: type,
      lastMessage: '',
      avatar: profileImageUrl, // Use provided profile image URL or a default avatar
    });

    console.log('Chat room created with ID: ', docRef.id);
  } catch (error) {
    const e = error as Error;
    console.error('Error adding chat room: ', e.message);
  }
};

/**
 * Fetches chat rooms based on the type
 * @param {string} type - The type of chat rooms to fetch (e.g., 'buddy', 'friends')
 * @returns {Promise<any[]>} - An array of chat rooms
 */
export const fetchChatRooms = async (type: string): Promise<any[]> => {
  try {
    const chatRoomCollection = collection(db, "chatRooms");
    const chatRoomQuery = query(chatRoomCollection, where("type", "==", type));
    const querySnapshot = await getDocs(chatRoomQuery);
    const chatRooms: any[] = [];
    querySnapshot.forEach((doc) => {
      chatRooms.push({ id: doc.id, ...doc.data() });
    });
    return chatRooms;
  } catch (e) {
    console.error("Error fetching chat rooms: ", e);
    alert("Internal error fetching chat rooms. Please try again later.");
    return [];
  }
};

/**
 * Deletes a chat room by its ID
 * @param {string} id - The ID of the chat room to delete
 * @returns {Promise<void>}
 */
export const deleteChatRoom = async (id: string): Promise<void> => {
  try {
    const chatRoomDoc = doc(db, 'chatRooms', id);
    await deleteDoc(chatRoomDoc);
    console.log('Chat room deleted with ID: ', id);
  } catch (error) {
    console.error('Error deleting chat room: ', error);
  }
};

/**
 * Sends a message in a chat room
 * @param chatRoomId - ID of the chat room
 * @param text - Message text
 */
export const sendMessage = async (chatRoomId: string, text: string) => {
  try {
    const messagesCollection = collection(db, "chatRooms", chatRoomId, "messages");
    await addDoc(messagesCollection, {
      text,
      userId: auth.currentUser?.uid,
      timestamp: new Date(),
    });
  } catch (e) {
    console.error("Error sending message: ", e);
    alert("Internal error sending message. Please try again later.");
  }
};

/**
 * Fetches messages in a chat room
 * @param chatRoomId - ID of the chat room
 * @returns an array of messages
 */
export const fetchMessages = async (chatRoomId: string) => {
  try {
    const messagesCollection = collection(db, "chatRooms", chatRoomId, "messages");
    const messagesQuery = query(messagesCollection, orderBy("timestamp", "asc"));
    const querySnapshot = await getDocs(messagesQuery);
    const messages: any[] = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    return messages;
  } catch (e) {
    console.error("Error fetching messages: ", e);
    alert("Internal error fetching messages. Please try again later.");
    return [];
  }
};