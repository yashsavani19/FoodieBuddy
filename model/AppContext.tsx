import { ReactNode, createContext, useState } from "react";
import { Restaurant } from "./Restaurant";
import { LocationObjectCoords } from "expo-location";
import { Saved } from "./Saved";
import fetchNearbyRestaurants from "@/controller/FetchNearbyRestaurants";
import {
  fetchBookmarks,
  fetchFavourites,
  fetchVisited,
} from "@/controller/DatabaseHandler";
import * as Location from "expo-location";
import { IMessage } from "./AITypes";
import { DefaultAISystemPrompt } from "./DefaultAISystemPrompt";

export type AppContextType = {
  localRestaurants: Restaurant[];
  setRestaurants: () => Promise<void>;
  favourites: Saved[];
  setFavourites: (favourites: Saved[]) => void;
  bookmarks: Saved[];
  setBookmarks: (bookmarks: Saved[]) => void;
  visited: Saved[];
  setVisited: (visited: Saved[]) => void;
  location: LocationObjectCoords | null;
  updateLocation: (location: LocationObjectCoords | null) => void;
  defaultMessage: IMessage;
  resetToDefaultMessage: () => void;
  chatMessages: IMessage[];
  addChatMessage: (message: IMessage) => void;
  user: any;
  setUser: () => Promise<void>;
};

interface ContextProviderProps {
  children: ReactNode;
}

export const AppContext = createContext<AppContextType>({
  localRestaurants: [],
  setRestaurants: async () => {},
  favourites: [],
  setFavourites: async () => {},
  bookmarks: [],
  setBookmarks: async () => {},
  visited: [],
  setVisited: async () => {},
  location: null,
  updateLocation: async () => {},
  defaultMessage: {},
  resetToDefaultMessage: async () => {},
  chatMessages: [],
  addChatMessage: async () => {},
  user: {},
  setUser: async () => {},
});

export const ContextProvider: React.FC<ContextProviderProps> = ({
  children,
}) => {
  const [localRestaurants, setRestaurantsArray] = useState<Restaurant[]>([]);
  const [favourites, setFavouritesArray] = useState<Saved[]>([]);
  const [bookmarks, setBookmarksArray] = useState<Saved[]>([]);
  const [visited, setVisitedArray] = useState<Saved[]>([]);
  const [location, setLocationArray] = useState<LocationObjectCoords | null>(
    null
  );
  const [defaultMessage, setDefaultMessage] = useState<IMessage>({});
  const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
  const [user, setUserObject] = useState<any>({});

  const setRestaurants = async () => {
    try {
      await updateLocation().then(async (locationCoords) => {
        console.log("Location before fetching:", locationCoords);
        const nearbyRestaurants = await fetchNearbyRestaurants(
          locationCoords as LocationObjectCoords
        );

        // Sort restaurants by distance (May need improving in future)
        const distanceSortedRestaurants = nearbyRestaurants.sort(
          (a, b) => a.distance - b.distance
        );
        setRestaurantsArray(distanceSortedRestaurants);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const setFavourites = async () => {
    try {
      // await setFavouritesArray(await fetchFavourites());
    } catch (error) {
      console.log(error);
    }
  };

  const setBookmarks = async () => {
    try {
      // await setBookmarksArray(await fetchBookmarks());
    } catch (error) {
      console.log(error);
    }
  };

  const setVisited = async () => {
    try {
      // await setVisitedArray(await fetchVisited());
    } catch (error) {
      console.log(error);
    }
  };

  const setUser = async () => {
    try {
      // await setUserObject(await fetchUser());
    } catch (error) {
      console.log(error);
    }
  };

  const updateLocation = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Permission to access location was denied");
          reject("Permission denied");
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setLocationArray(location.coords);
        console.log("Location updated:", location);
        resolve(location.coords);
      } catch (error) {
        console.error("Error updating location:", error);
        reject(error);
      }
    });
  };

  const resetToDefaultMessage = () => {
    setDefaultMessage({
      role: "system",
      message: DefaultAISystemPrompt(localRestaurants),
    } as IMessage);
  };

  const addChatMessage = (message: IMessage) => {
    setChatMessages([...chatMessages, message]);
    if (chatMessages.length > 11) {
      chatMessages.splice(1, chatMessages.length - 11);
    }
  };

  const contextValue = {
    localRestaurants,
    setRestaurants,
    favourites,
    setFavourites,
    bookmarks,
    setBookmarks,
    visited,
    setVisited,
    location,
    updateLocation,
    defaultMessage,
    resetToDefaultMessage,
    chatMessages,
    addChatMessage,
    user,
    setUser,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
