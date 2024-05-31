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
  onSnapshot,
  orderBy,
  limit,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/controller/FirebaseHandler";
import { Saved } from "@/model/Saved";
import { auth } from "@/controller/FirebaseHandler";
import { Restaurant } from "@/model/Restaurant";
import { Friend } from "@/model/Friend";
import { DefaultPreferences } from "@/model/DefaultPreferences";
import { PreferenceList } from "@/model/PreferenceList";
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
  if (restaurant.currentOpeningHours === undefined)
    restaurant.currentOpeningHours = "";
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
    await addPreferences(uid);
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
      const userData = docSnap.data();
      const preferences = await fetchPreferences();

      //------------LOGGING PURPOSES----------------

      if (preferences !== undefined) {
        preferences.forEach((category) => {
          category.preferences.forEach((preference) => {
            console.log(
              `Login Fetched Preference: ${preference.name}, Login Fetched Preference Selected: ${preference.selected}, Login Fetched Preference Category: ${category.title}`
            );
          });
        });
      }else{
        console.log("Preferences is undefined");
      }

      //------------LOGGING PURPOSES----------------

      return { ...userData, preferences };
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
      // alert("Username already exists. Please choose a different one.");
      return false;
    }

    await setDoc(doc(db, "usernames", username), {
      uid: uid,
      profileImageUrl:
        profileImageUrl ||
        "https://firebasestorage.googleapis.com/v0/b/foodie-buddy-418307.appspot.com/o/user-icon.png?alt=media&token=9003ba31-6b47-4f58-b98a-fc3c82e8d537",
    });
    const currentUserCollection = `users/${uid}`;
    await setDoc(doc(db, currentUserCollection), {
      username: username,
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
  username: string
): Promise<Friend | null> => {
  try {
    const usernameCollection = "usernames";
    const docRef = doc(db, usernameCollection, username);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const found = {
        username: docSnap.id,
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
 * Set profile image URL for user in usernames collection and user collection
 * @param uid user id
 * @param profileImageUrl profile image URL
 */

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
    const preferencesCollection = `users/${uid}/preferences`;
    const querySnapshot = await getDocs(collection(db, friendCollection));
    const friends: Friend[] = [];
    querySnapshot.forEach(async (doc) => {
      const username = await getUsername(doc.id);
      const profileImageUrl = await getProfileImageUrl(doc.id);
      console.log("Friends fetched: ", username, profileImageUrl, doc.id);
      friends.push({
        uid: doc.id,
        username: username,
        profileImageUrl: profileImageUrl,
        preferences: await fetchFriendsPreferences(doc.id),
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
 * Subscribe to friends listener
 */

export const subscribeToFriends = (
  callback: (friends: Friend[]) => void
): (() => void) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return () => {}; // Return a no-op if uid is not available
  const friendCollection = `users/${uid}/friends`;

  const unsubscribe = onSnapshot(
    collection(db, friendCollection),
    async (snapshot) => {
      const friends: Friend[] = [];
      for (const doc of snapshot.docs) {
        const username = await getUsername(doc.id);
        const profileImageUrl = await getProfileImageUrl(doc.id);
        friends.push({
          uid: doc.id,
          username: username,
          profileImageUrl: profileImageUrl,
        });
      }
      callback(friends);
    }
  );

  return unsubscribe;
};

/**
 * Adds friend to user's friends
 * @param friend friend object to add
 */
export const addFriend = async (friend: Friend) => {
  try {
    const currentUserUid = auth.currentUser?.uid;
    if (!currentUserUid) {
      console.error("User not authenticated");
      alert("You must be logged in to add friends.");
      return;
    }
    const uid = friend.uid;
    const friendRequestCollection = `users/${uid}/friendRequests`;
    const docRef = doc(db, friendRequestCollection, currentUserUid);
    await setDoc(docRef, {
      adddeOn: new Date(),
    });
    const currentUserRequestCollection = `users/${currentUserUid}/sentFriendRequests`;
    const docRef2 = doc(db, currentUserRequestCollection, uid);
    await setDoc(docRef2, {
      addedOn: new Date(),
    });
    console.log("Sent friend request: ", friend.username);
  } catch (e) {
    console.error("Error adding document: ", e);
    alert("Internal error adding friend. Please try again later.");
  }
};

/**
 * Confirm friend request
 * @param friend friend object to add
 */
export const confirmFriendRequest = async (friend: Friend) => {
  try {
    const currentUserUid = auth.currentUser?.uid;
    if (!currentUserUid) {
      console.error("User not authenticated");
      alert("You must be logged in to add friends.");
      return;
    }
    let friendCollection = `users/${currentUserUid}/friends`;
    let docRef = doc(db, friendCollection, friend.uid);
    await setDoc(docRef, {
      addedOn: new Date(),
    });
    friendCollection = `users/${friend.uid}/friends`;
    docRef = doc(db, friendCollection, currentUserUid);
    await setDoc(docRef, {
      addedOn: new Date(),
    });
    const friendRequestCollection = `users/${currentUserUid}/friendRequests`;
    await deleteDoc(doc(db, friendRequestCollection, friend.uid));
    console.log("Friend added: ", friend.username);
    const currentUserRequestCollection = `users/${friend.uid}/sentFriendRequests`;
    await deleteDoc(doc(db, currentUserRequestCollection, currentUserUid));
  } catch (e) {
    console.error("Error adding document: ", e);
    alert("Internal error adding friend. Please try again later.");
  }
};

/**
 * Reject friend request
 * @param friend friend object to reject
 */
export const rejectFriendRequest = async (friend: Friend) => {
  try {
    const currentUserUid = auth.currentUser?.uid;
    if (!currentUserUid) {
      console.error("User not authenticated");
      alert("You must be logged in to add friends.");
      return;
    }
    const friendCollection = `users/${currentUserUid}/friendRequests`;
    await deleteDoc(doc(db, friendCollection, friend.uid));
    console.log("Friend request rejected: ", friend.username);
  } catch (e) {
    console.error("Error removing document: ", e);
    alert("Internal error removing friend request. Please try again later.");
  }
};

/**
 * Removes friend from user's friends
 * @param friend friend object to remove
 */
export const removeFriend = async (friend: Friend) => {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      throw new Error("User not authenticated");
    }

    const friendCollection = `users/${uid}/friends`;
    await deleteDoc(doc(db, friendCollection, friend.uid));

    const friendCollection2 = `users/${friend.uid}/friends`;
    await deleteDoc(doc(db, friendCollection2, uid));

    console.log("Friend successfully removed");
  } catch (e) {
    console.error("Error removing document: ", e);
    alert("Internal error removing friend. Please try again later.");
  }
};

/**
 *  Remove sent friend request
 * @param friend friend object to remove
 */
export const removeSentFriendRequest = async (friend: Friend) => {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      throw new Error("User not authenticated");
    }

    const friendCollection = `users/${uid}/sentFriendRequests`;
    await deleteDoc(doc(db, friendCollection, friend.uid));
    const otherUserCollection = `users/${friend.uid}/friendRequests`;
    await deleteDoc(doc(db, otherUserCollection, uid));

    console.log("Sent friend request successfully removed");
  } catch (e) {
    console.error("Error removing document: ", e);
    alert("Internal error removing friend request. Please try again later.");
  }
};

/**
 * fetches friend requests and sent requests
 * @returns array of friend requests
 */
export const fetchFriendRequests = async (): Promise<{
  receivedRequests: Friend[];
  sentRequests: Friend[];
}> => {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      throw new Error("User not authenticated");
    }

    // Define collections for received and sent friend requests
    const friendRequestCollection = `users/${uid}/friendRequests`;
    const sentFriendRequestCollection = `users/${uid}/sentFriendRequests`;

    // Fetch received friend requests
    const receivedRequestsSnapshot = await getDocs(
      collection(db, friendRequestCollection)
    );
    const sentRequestsSnapshot = await getDocs(
      collection(db, sentFriendRequestCollection)
    );

    // Fetch received friend requests
    const receivedRequests: Friend[] = await Promise.all(
      receivedRequestsSnapshot.docs.map(async (doc) => {
        const username = await getUsername(doc.id);
        const profileImageUrl = await getProfileImageUrl(doc.id);
        return {
          uid: doc.id,
          username: username,
          profileImageUrl: profileImageUrl,
        };
      })
    );

    // Fetch sent friend requests
    const sentRequests: Friend[] = await Promise.all(
      sentRequestsSnapshot.docs.map(async (doc) => {
        const username = await getUsername(doc.id);
        const profileImageUrl = await getProfileImageUrl(doc.id);
        return {
          uid: doc.id,
          username: username,
          profileImageUrl: profileImageUrl,
        };
      })
    );

    return { receivedRequests, sentRequests };
  } catch (e) {
    console.error("Error getting documents: ", e);
    alert("Internal error fetching friend requests. Please try again later.");
    return {} as { receivedRequests: Friend[]; sentRequests: Friend[] };
  }
};

/**
 *  Subscribes to friend requests listener
 * @param callback callback function to execute on change
 * @returns unsubscribe function
 */
export const subscribeToReceivedFriendRequests = (
  callback: (receivedRequests: Friend[]) => void
): (() => void) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return () => {}; // Return a no-op if uid is not available

  const receivedRequestsCollection = `users/${uid}/friendRequests`;

  const unsubscribeReceived = onSnapshot(
    collection(db, receivedRequestsCollection),
    async (snapshot) => {
      const receivedRequests: Friend[] = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const username = await getUsername(doc.id);
          const profileImageUrl = await getProfileImageUrl(doc.id);
          return {
            uid: doc.id,
            username: username,
            profileImageUrl: profileImageUrl,
          };
        })
      );
      callback(receivedRequests);
    },
    (error) => {
      console.error("Error fetching received friend requests: ", error);
    }
  );

  return () => {
    unsubscribeReceived();
  };
};

/**
 * Subscribes to sent friend requests listener
 * @param callback callback function to execute on change
 * @returns unsubscribe function
 */
export const subscribeToSentFriendRequests = (
  callback: (sentRequests: Friend[]) => void
): (() => void) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return () => {}; // Return a no-op if uid is not available

  const sentRequestsCollection = `users/${uid}/sentFriendRequests`;

  const unsubscribeSent = onSnapshot(
    collection(db, sentRequestsCollection),
    async (snapshot) => {
      const sentRequests: Friend[] = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const username = await getUsername(doc.id);
          const profileImageUrl = await getProfileImageUrl(doc.id);
          return {
            uid: doc.id,
            username: username,
            profileImageUrl: profileImageUrl,
          };
        })
      );
      callback(sentRequests);
    },
    (error) => {
      console.error("Error fetching sent friend requests: ", error);
    }
  );

  return () => {
    unsubscribeSent();
  };
};

/**
 * Fetches friends favourites
 */
export const fetchFriendsFavourites = async (uid: string) => {
  try {
    const favouriteCollection = `users/${uid}/favourites`;
    const querySnapshot = await getDocs(collection(db, favouriteCollection));
    const favourites: Saved[] = [];
    querySnapshot.forEach((doc) => {
      favourites.push({
        restaurant: doc.data().restaurant as Restaurant,
        addedOn: doc.data().addedOn as Date,
      });
    });
    return favourites;
  } catch (e) {
    console.error("Error getting documents: ", e);
    alert(
      "Internal error fetching friends favourites. Please try again later."
    );
  }
};

/**
 * Fetches friends bookmarks
 */
export const fetchFriendsBookmarks = async (uid: string) => {
  try {
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
    alert("Internal error fetching friends bookmarks. Please try again later.");
  }
};

/**
 * Fetches friends visited
 */
export const fetchFriendsVisited = async (uid: string) => {
  try {
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
    alert("Internal error fetching friends visited. Please try again later.");
  }
};

/**
 * Fetches all usernames from the usernames collection
 * @returns an array of usernames
 */
export const fetchAllUsernames = async (): Promise<{
  [key: string]: { username: string; profileImageUrl: string };
}> => {
  try {
    const usernameCollection = collection(db, "usernames");
    const querySnapshot = await getDocs(usernameCollection);
    const usernameDict: {
      [key: string]: { username: string; profileImageUrl: string };
    } = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      usernameDict[data.uid] = {
        username: doc.id,
        profileImageUrl:
          data.profileImageUrl ||
          "https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg",
      };
    });

    return usernameDict;
  } catch (e) {
    console.error("Error fetching usernames: ", e);
    alert("Internal error fetching usernames. Please try again later.");
    return {};
  }
};

/**
 * Creates a new chat room
 * @param {string} roomName - The name of the chat room
 * @param {string} type - The type of chat room (e.g., 'buddy', 'friends')
 * @param {string} profileImageUrl - The image URL for the chat room (default is a placeholder image)
 * @returns {Promise<void>}
 */
export const createChatRoom = async (
  roomName: string,
  type: string,
  profileImageUrl: string = "https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg",
  allowedUsers: string[] = []
) => {
  try {
    console.log("Allowed Users:", allowedUsers); 
    const docRef = await addDoc(collection(db, "chatRooms"), {
      name: roomName,
      type: type,
      lastMessage: "",
      avatar: profileImageUrl,
      allowedUsers: allowedUsers.length ? allowedUsers : [], 
    });

    console.log("Chat room created with ID: ", docRef.id);
  } catch (error) {
    const e = error as Error;
    console.error("Error adding chat room: ", e.message);
  }
};
/**
 * Fetches chat rooms of a specified type that the current user is allowed to access.
 * 
 * @param {string} type - Type of the chat room.
 * @returns {Promise<any[]>} - A promise that resolves to an array of chat rooms.
 */
export const fetchChatRooms = async (type: string) => {
  const chatRoomsRef = collection(db, "chatRooms");
  const currentUserUid = auth.currentUser?.uid;

  if (!currentUserUid) {
    throw new Error("User not authenticated");
  }

  const q = query(chatRoomsRef, where("type", "==", type), where("allowedUsers", "array-contains", currentUserUid));
  const querySnapshot = await getDocs(q);
  const chatRooms = [];

  for (const doc of querySnapshot.docs) {
    const lastMessageRef = collection(db, `chatRooms/${doc.id}/messages`);
    const lastMessageQuery = query(
      lastMessageRef,
      orderBy("timestamp", "desc"),
      limit(1)
    );
    const lastMessageSnapshot = await getDocs(lastMessageQuery);
    const lastMessageData = lastMessageSnapshot.docs[0]?.data();

    let lastMessage = lastMessageData ? lastMessageData.text : "";
    if (lastMessage.length > 50) {
      lastMessage = `${lastMessage.substring(0, 30)}...`;
    }

    chatRooms.push({
      id: doc.id,
      name: doc.data().name,
      lastMessage,
      lastMessageTimestamp: lastMessageData
        ? lastMessageData.timestamp.toDate()
        : null,
      avatar: doc.data().avatar,
    });
  }
  return chatRooms;
};


/**
 * Deletes a chat room by its ID
 * @param {string} id - The ID of the chat room to delete
 * @returns {Promise<void>}
 */
export const deleteChatRoom = async (id: string): Promise<void> => {
  try {
    const chatRoomDoc = doc(db, "chatRooms", id);
    await deleteDoc(chatRoomDoc);
    console.log("Chat room deleted with ID: ", id);
  } catch (error) {
    console.error("Error deleting chat room: ", error);
  }
};

/**
 * Sends a message in a chat room.
 * 
 * @param {string} chatRoomId - ID of the chat room.
 * @param {string} text - Message text.
 * @param {string} [userId] - Optional user ID (default is the current user's ID).
 * @returns {Promise<void>} - A promise that resolves when the message is sent.
 */
export const sendMessage = async (chatRoomId: string, text: string, userId?: string) => {
  try {
    const messagesCollection = collection(
      db,
      "chatRooms",
      chatRoomId,
      "messages"
    );
    await addDoc(messagesCollection, {
      text,
      userId: userId || auth.currentUser?.uid, // Use the provided user ID or default to the current user's ID
      timestamp: serverTimestamp(), // Use serverTimestamp for consistent server-side timestamps
    });
  } catch (e) {
    console.error("Error sending message: ", e);
    alert("Internal error sending message. Please try again later.");
  }
};

/**
 * Fetches messages in a chat room.
 * 
 * @param {string} chatRoomId - ID of the chat room.
 * @returns {Promise<any[]>} - A promise that resolves to an array of messages.
 */
export const fetchMessages = async (chatRoomId: string) => {
  try {
    const messagesCollection = collection(
      db,
      "chatRooms",
      chatRoomId,
      "messages"
    );
    const messagesQuery = query(
      messagesCollection,
      orderBy("timestamp", "asc")
    );
    const querySnapshot = await getDocs(messagesQuery);
    const messages: any[] = [];
    const placeholderImage =
      "https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"; // Replace with your placeholder image URL

    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data();
      const timestamp = data.timestamp ? data.timestamp.toDate() : new Date();
      const userDoc = await getDoc(doc(db, "users", data.userId));
      const userProfile = userDoc.exists() ? userDoc.data() : {};
      messages.push({
        id: docSnapshot.id,
        text: data.text,
        userId: data.userId,
        timestamp,
        userProfileImage: userProfile.profilePicture || placeholderImage,
      });
    }

    return messages;
  } catch (e) {
    console.error("Error fetching messages: ", e);
    alert("Internal error fetching messages. Please try again later.");
    return [];
  }
};

/**
 * Deletes a message from a chat room by its ID
 * @param {string} chatRoomId - ID of the chat room
 * @param {string} messageId - ID of the message to delete
 * @returns {Promise<void>} - A promise that resolves when the message is deleted
 */
export const deleteMessage = async (
  chatRoomId: string,
  messageId: string
): Promise<void> => {
  try {
    const messageDoc = doc(db, "chatRooms", chatRoomId, "messages", messageId);
    await deleteDoc(messageDoc);
    console.log("Message deleted with ID: ", messageId);
  } catch (e) {
    console.error("Error deleting message: ", e);
    alert("Internal error deleting message. Please try again later.");
  }
};

/**
 * Updates the typing status of a user in a specified chat room.
 * 
 * @param {string} chatRoomId - The ID of the chat room.
 * @param {string} userId - The ID of the user.
 * @param {string} username - The username of the user.
 * @param {boolean} isTyping - The current typing status of the user.
 * @returns {Promise<void>} - A promise that resolves when the typing status is updated
 */
export const updateTypingStatus = async (chatRoomId: string, userId: string, username: string, isTyping: boolean) => {
  if (!userId) {
    console.error("User not authenticated");
    return;
  }

  try {
    const typingStatusDoc = doc(db, "chatRooms", chatRoomId, "typingStatus", userId);
    await setDoc(typingStatusDoc, { isTyping, username }, { merge: true });
  } catch (error) {
    console.error("Error updating typing status:", error);
  }
};

/**
 * Listens to typing status changes in a specified chat room and executes a callback with the updated typing users.
 * 
 * @param {string} chatRoomId - The ID of the chat room.
 * @param {function} callback - The callback function to execute with the updated typing users.
 * @returns {function} - Unsubscribe function to stop listening to typing status changes.
 */
export const listenToTypingStatus = (chatRoomId: string, callback: (typingUsers: { [key: string]: { isTyping: boolean, username: string } }) => void) => {
  const typingStatusCollection = collection(db, "chatRooms", chatRoomId, "typingStatus");
  return onSnapshot(typingStatusCollection, (snapshot) => {
    const typingUsers: { [key: string]: { isTyping: boolean, username: string } } = {};
    snapshot.forEach((doc) => {
      const data = doc.data() as { isTyping: boolean, username: string };
      typingUsers[doc.id] = data;
    });
    callback(typingUsers);
  });
};



export const addPreferences = async (uid: string) => {
  try {
    const preferenceCollection = `users/${uid}/preferences`;

    for (const category of DefaultPreferences) {
      for (const preference of category.preferences) {
        const docRef = doc(
          db,
          preferenceCollection,
          `${category.title}-${preference.name}`
        );
        console.log(
          "Preference: ",
          preference.name,
          ", Selected: ",
          preference.selected,
          ", Category: ",
          category.title
        );
        await setDoc(docRef, {
          name: preference.name,
          selected: preference.selected,
          category: category.title,
        });
      }
    }
    console.log("Default preferences added to collection");
  } catch (e) {
    console.error("Error adding preferences: ", e);
    alert("Internal error adding preferences. Please try again later.");
  }
};

// /**
//  * Fetches user preferences
//  */
export const fetchPreferences = async (): Promise<PreferenceList[]> => {
  try {
    const uid = auth.currentUser?.uid;
    const preferenceCollection = `users/${uid}/preferences`;
    const querySnapshot = await getDocs(collection(db, preferenceCollection));
    const preferences: PreferenceList[] = [];

    // Group preferences by category
    const categoryMap: { [key: string]: Preference[] } = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const category = data.category;
      const preference: Preference = {
        name: data.name,
        selected: data.selected,
        apiName: data.apiName,
      };
      if (!categoryMap[category]) {
        categoryMap[category] = [];
      }
      categoryMap[category].push(preference);
    });

    for (const category in categoryMap) {
      preferences.push({
        title: category,
        preferences: categoryMap[category],
      });
    }

    return preferences;
  } catch (e) {
    console.error("Error getting documents: ", e);
    alert("Internal error fetching preferences. Please try again later.");
    return [];
  }
};

/**
 * Gets friends preferences
 * @param uid user id
 */
export const fetchFriendsPreferences = async (uid: string) => {
  try {
    const preferenceCollection = `users/${uid}/preferences`;
    const querySnapshot = await getDocs(collection(db, preferenceCollection));
    const preferences: PreferenceList[] = [];

    // Group preferences by category
    const categoryMap: { [key: string]: Preference[] } = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const category = data.category;
      const preference: Preference = {
        name: data.name,
        selected: data.selected,
        apiName: data.apiName,
      };
      if (!categoryMap[category]) {
        categoryMap[category] = [];
      }
      categoryMap[category].push(preference);
    });

    for (const category in categoryMap) {
      preferences.push({
        title: category,
        preferences: categoryMap[category],
      });
    }

    return preferences;
  } catch (e) {
    console.error("Error getting documents: ", e);
    alert("Internal error fetching preferences. Please try again later.");
    return [];
  }
};

export const updatePreferences = async (updatedPreferences: PreferenceList[]) => {
  try {
    const uid = auth.currentUser?.uid;
    const preferenceCollection = `users/${uid}/preferences`;

    for (const category of updatedPreferences) {
      for (const preference of category.preferences) {
        const docRef = doc(
          db,
          preferenceCollection,
          `${category.title}-${preference.name}`
        );
        console.log(
          "Updating Preference: ",
          preference.name,
          ", Selected: ",
          preference.selected,
          ", Category: ",
          category.title
        );
        await setDoc(docRef, {
          category: category.title,
          name: preference.name,
          selected: preference.selected,
        });
      }
    }
    console.log("Preferences updated successfully");
  } catch (e) {
    console.error("Error updating preferences: ", e);
    alert("Internal error updating preferences. Please try again later.");
  }
};