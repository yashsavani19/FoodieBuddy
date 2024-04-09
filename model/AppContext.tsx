import { createContext } from "react";
import { Restaurant } from "./Restaurant";

export type AppContextType = {
  localRestaurants: Restaurant[];
  setRestaurants: (localRestaurants: Restaurant[]) => void;
  favourites: Restaurant[];
  setFavourites: (favourites: Restaurant[]) => void;
  bookmarks: Restaurant[];
  setBookmarks: (bookmarks: Restaurant[]) => void;
  visited: Restaurant[];
  setVisited: (visited: Restaurant[]) => void;
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
});