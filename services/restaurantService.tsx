import { Favourite } from "@/model/Favourite";
import { Restaurant } from "../model/Restaurant";
import { Bookmark } from "@/model/Bookmark";
import { Visited } from "@/model/Visited";
import {
  fetchFavourites,
  fetchBookmarks,
  fetchVisited,
} from "@/controller/DatabaseHandler";

let localRestaurantsList: Restaurant[];
let favouritesList: Favourite[];
let bookmarksList: Bookmark[];
let visitedList: Visited[];

export const getLocalRestaurants = (): Restaurant[] => {
  return localRestaurantsList;
};

export const getFavourites = (): Favourite[] => {
  return favouritesList;
};

export const getBookmarks = (): Bookmark[] => {
  return bookmarksList;
};

export const getVisited = (): Visited[] => {
  return visitedList;
};

export const fetchFavouritesFromDB = async () => {
  try {
    const placeIdList = await fetchFavourites();
    // Fetch favourites from Maps handler
    // Add favourites to favouritesList
  } catch (e) {
    console.error("Error getting documents: ", e);
    alert("Internal error fetching favourites. Please try again later.");
  }
};

export const fetchBookmarksFromDB = async () => {
  try {
    const placeIdList = await fetchBookmarks();
    // Fetch bookmarks from Maps handler
    // Add bookmarks to bookmarksList
  } catch (e) {
    console.error("Error getting documents: ", e);
    alert("Internal error fetching bookmarks. Please try again later.");
  }
};

export const fetchVisitedFromDB = async () => {
  try {
    const placeIdList = await fetchVisited();
    // Fetch visited from Maps handler
    // Add visited to visitedList
  } catch (e) {
    console.error("Error getting documents: ", e);
    alert("Internal error fetching visited. Please try again later.");
  }
};

export const addFavouriteFromDB = async (
  placeId: string,
  restaurant: Restaurant
) => {
  // Add favourite to database
  const favourite = new Favourite(placeId, new Date(), restaurant);
  favouritesList.push(favourite);
};

export const removeFavouriteFromDB = async (placeId: string) => {
  // Remove favourite from database
  favouritesList = favouritesList.filter(
    (favourite) => favourite.getPlaceId() !== placeId
  );
};

export const addBookmarkFromDB = async (
  placeId: string,
  restaurant: Restaurant
) => {
  // Add bookmark to database
  const bookmark = new Bookmark(placeId, new Date(), restaurant);
  bookmarksList.push(bookmark);
};

export const removeBookmarkFromDB = async (placeId: string) => {
  // Remove bookmark from database
  bookmarksList = bookmarksList.filter(
    (bookmark) => bookmark.getPlaceId() !== placeId
  );
};

export const addVisitedFromDB = async (
  placeId: string,
  restaurant: Restaurant
) => {
  // Add visited to database
  const visited = new Visited(placeId, new Date(), restaurant);
  visitedList.push(visited);
};

export const removeVisitedFromDB = async (placeId: string) => {
  // Remove visited from database
  visitedList = visitedList.filter((visited) => visited.getPlaceId() !== placeId);
};
