import { createContext } from "react";
import { Restaurant } from "./Restaurant";
import { LocationObjectCoords } from "expo-location";
import { Saved } from "./Saved";

export type AppContextType = {
  localRestaurants: Restaurant[];
  setRestaurants: (localRestaurants: Restaurant[]) => void;
  favourites: Saved[];
  setFavourites: (favourites: Saved[]) => void;
  bookmarks: Saved[];
  setBookmarks: (bookmarks: Saved[]) => void;
  visited: Saved[];
  setVisited: (visited: Saved[]) => void;
  location: LocationObjectCoords | null;
  setLocation: (location: LocationObjectCoords | null) => void;
  fetchRestaurants: () => Promise<void>;
};

export const AppContext = createContext<AppContextType>({
  localRestaurants: [],
  setRestaurants: () => {},
  favourites: [],
  setFavourites: () => {},
  bookmarks: [],
  setBookmarks: () => {},
  visited: [],
  setVisited: () => {},
  location: null,
  setLocation: () => {},
  fetchRestaurants: async () => {},
});