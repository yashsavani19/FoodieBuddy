import { Preference } from "@/model/Preference";
import firestore from "@react-native-firebase/firestore";

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

/**
 * Adds favourite to user's favourites
 * @param userId authenticated user id
 * @param placeId Maps API place id
 */
export const addFavourite = async (userId: string, placeId: string) => {
  await firestore()
    .collection("users")
    .doc(userId)
    .collection("favourites")
    .doc(placeId)
    .set({
      placeId: placeId,
      addedOn: firestore.FieldValue.serverTimestamp(),
    });
};

/**
 * Removes favourite from user's favourites
 * @param userId authenticated user id
 * @param placeId Maps API place id
 */
export const removeFavourite = async (userId: string, placeId: string) => {
  await firestore()
    .collection("users")
    .doc(userId)
    .collection("favourites")
    .doc(placeId)
    .delete();
};

/**
 * Fetches favourites from user
 * @param userId authenticated user id
 */
export const fetchFavourites = async (userId: string) => {
  const favourites = await firestore()
    .collection("users")
    .doc(userId)
    .collection("favourites")
    .get();
  return favourites.docs.map((doc) => doc.data());
};

/**
 * Adds bookmark to user's bookmarks
 * @param userId authenticated user id
 * @param placeId Maps API place id
 */
export const addBookmark = async (userId: string, placeId: string) => {
  await firestore()
    .collection("users")
    .doc(userId)
    .collection("bookmarks")
    .doc(placeId)
    .set({
      placeId: placeId,
      addedOn: firestore.FieldValue.serverTimestamp(),
    });
};

/**
 * Removes bookmark from user's bookmarks
 * @param userId authenticated user id
 * @param placeId Maps API place id
 */
export const removeBookmark = async (userId: string, placeId: string) => {
  await firestore()
    .collection("users")
    .doc(userId)
    .collection("bookmarks")
    .doc(placeId)
    .delete();
};

/**
 * Fetches bookmarks from user
 * @param userId authenticated user id
 */
export const fetchBookmarks = async (userId: string) => {
  const bookmarks = await firestore()
    .collection("users")
    .doc(userId)
    .collection("bookmarks")
    .get();
  return bookmarks.docs.map((doc) => doc.data());
};

/**
 * Adds visited to user's visited
 * @param userId authenticated user id
 * @param placeId Maps API place id
 */
export const addVisited = async (userId: string, placeId: string) => {
  await firestore()
    .collection("users")
    .doc(userId)
    .collection("visited")
    .doc(placeId)
    .set({
      placeId: placeId,
      addedOn: firestore.FieldValue.serverTimestamp(),
    });
};

/**
 * Removes visited from user's visited
 * @param userId authenticated user id
 * @param placeId Maps API place id
 */
export const removeVisited = async (userId: string, placeId: string) => {
  await firestore()
    .collection("users")
    .doc(userId)
    .collection("visited")
    .doc(placeId)
    .delete();
};

/**
 * Fetches visited from user
 * @param userId authenticated user id
 */
export const fetchVisited = async (userId: string) => {
  const visited = await firestore()
    .collection("users")
    .doc(userId)
    .collection("visited")
    .get();
  return visited.docs.map((doc) => doc.data());
};

/**
 * Fetches user data
 * @param userId authenticated user id
 */
export const fetchUser = async (userId: string) => {
  const user = await firestore().collection("users").doc(userId).get();
  return user.data();
};

/**
 * Updates username
 * @param userId authenticated user id
 * @param newUsername new username
 */
export const updateUsername = async (userId: string, newUsername: string) => {
  await firestore().collection("users").doc(userId).update({
    username: newUsername,
  });
};

// WARNING: Currently only updates database email, not authentication email
/**
 * Updates user email
 * @param userId authenticated user id
 * @param newEmail new email address
 */
export const updateEmail = async (userId: string, newEmail: string) => {
  await firestore().collection("users").doc(userId).update({
    email: newEmail,
  });
};

/**
 * Updates user profile picture
 * @param userId authenticated user id
 * @param newProfilePictureUrl new profile picture URL
 */
export const updateProfilePicture = async (
  userId: string,
  newProfilePictureUrl: string
) => {
  await firestore().collection("users").doc(userId).update({
    profilePicture: newProfilePictureUrl,
  });
};

/**
 * Adds preference to user's preferences
 * @param userId authenticated user id
 * @param preference preference object
 */
export const addPreference = async (userId: string, preference: Preference) => {
  await firestore()
    .collection("users")
    .doc(userId)
    .collection("preferences")
    .doc(preference.preferenceId)
    .set({
      name: preference.preferenceId,
    });
};

/**
 * Removes preference from user's preferences
 * @param userId authenticated user id
 * @param preferenceId preference id
 */
export const removePreference = async (
  userId: string,
  preferenceId: string
) => {
  await firestore()
    .collection("users")
    .doc(userId)
    .collection("preferences")
    .doc(preferenceId)
    .delete();
};

/**
 * Fetches preferences from user
 * @param userId authenticated user id
 */
export const fetchPreferences = async (userId: string) => {
  const preferences = await firestore()
    .collection("users")
    .doc(userId)
    .collection("preferences")
    .get();
  return preferences.docs.map((doc) => doc.data());
};
