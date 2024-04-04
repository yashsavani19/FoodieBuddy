import firestore from '@react-native-firebase/firestore';

export const addFavourite = async (userId: string, placeId: string) => {
    await firestore()
    .collection('users')
    .doc(userId)
    .collection('favourites')
    .doc(placeId)
    .set({
        placeId: placeId,
        addedOn: firestore.FieldValue.serverTimestamp(),
    });
};

export const removeFavourite = async (userId: string, placeId: string) => {
    await firestore()
    .collection('users')
    .doc(userId)
    .collection('favourites')
    .doc(placeId)
    .delete();
};

export const fetchFavourites = async (userId: string) => {
    const favourites = await firestore()
    .collection('users')
    .doc(userId)
    .collection('favourites')
    .get();
    return favourites.docs.map(doc => doc.data());
};

export const addBookmark = async (userId: string, placeId: string) => {
    await firestore()
    .collection('users')
    .doc(userId)
    .collection('bookmarks')
    .doc(placeId)
    .set({
        placeId: placeId,
        addedOn: firestore.FieldValue.serverTimestamp(),
    });
};

export const removeBookmark = async (userId: string, placeId: string) => {
    await firestore()
    .collection('users')
    .doc(userId)
    .collection('bookmarks')
    .doc(placeId)
    .delete();
};

export const fetchBookmarks = async (userId: string) => {
    const bookmarks = await firestore()
    .collection('users')
    .doc(userId)
    .collection('bookmarks')
    .get();
    return bookmarks.docs.map(doc => doc.data());
}

export const addVisited = async (userId: string, placeId: string) => {
    await firestore()
    .collection('users')
    .doc(userId)
    .collection('visited')
    .doc(placeId)
    .set({
        placeId: placeId,
        addedOn: firestore.FieldValue.serverTimestamp(),
    });
};

export const removeVisited = async (userId: string, placeId: string) => {
    await firestore()
    .collection('users')
    .doc(userId)
    .collection('visited')
    .doc(placeId)
    .delete();
};

export const fetchVisited = async (userId: string) => {
    const visited = await firestore()
    .collection('users')
    .doc(userId)
    .collection('visited')
    .get();
    return visited.docs.map(doc => doc.data());
};

export const fetchUser = async (userId: string) => {
    const user = await firestore()
    .collection('users')
    .doc(userId)
    .get();
    return user.data();
};

export const updateUsername = async (userId: string, newUsername: string) => {
    await firestore()
    .collection('users')
    .doc(userId)
    .update({
        username: newUsername,
    });
};

// WARNING: Currently only updates database email, not authentication email
export const updateEmail = async (userId: string, newEmail: string) => {
    await firestore()
    .collection('users')
    .doc(userId)
    .update({
        email: newEmail,
    });
};

export const updateProfilePicture = async (userId: string, newProfilePictureUrl: string) => {
    await firestore()
    .collection('users')
    .doc(userId)
    .update({
        profilePicture: newProfilePictureUrl,
    });
};