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
  if (restaurant.currentOpeningHours === undefined) restaurant.currentOpeningHours = "";
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
