import { ReactNode, createContext, useState } from "react";
import { Restaurant } from "../model/Restaurant";
import { LocationObjectCoords } from "expo-location";
import { Saved } from "../model/Saved";
import fetchNearbyRestaurants from "@/controller/FetchNearbyRestaurants";
import {
  fetchBookmarks,
  fetchFavourites,
  fetchVisited,
  fetchUser,
  addUser,
} from "@/controller/DatabaseHandler";
import * as Location from "expo-location";
import { IMessage } from "../model/AITypes";
import { DefaultAISystemPrompt } from "../model/DefaultAISystemPrompt";
import { User } from "@/model/User";
import { User as AuthUser } from "firebase/auth";
import { useAuth } from "./AuthContext";

export type AppContextType = {
  dataLoading: boolean;
  setDataLoading: (loading: boolean) => void;
  localRestaurants: Restaurant[];
  setRestaurants: () => Promise<void>;
  favouriteRestaurants: Restaurant[];
  bookmarkedRestaurants: Restaurant[];
  visitedRestaurants: Restaurant[];
  updateSaved: () => Promise<void>;
  location: LocationObjectCoords | null;
  updateLocation: (location: LocationObjectCoords | null) => void;
  defaultMessage: IMessage;
  resetToDefaultMessage: () => void;
  chatMessages: IMessage[];
  addChatMessage: (message: IMessage) => void;
  userObject: User;
  setUser: () => Promise<void>;
};

interface ContextProviderProps {
  children: ReactNode;
}

export const AppContext = createContext<AppContextType>({
  dataLoading: true,
  setDataLoading: () => {},
  localRestaurants: [],
  setRestaurants: async () => {},
  favouriteRestaurants: [],
  bookmarkedRestaurants: [],
  visitedRestaurants: [],
  updateSaved: async () => {},
  location: null,
  updateLocation: async () => {},
  defaultMessage: {},
  resetToDefaultMessage: async () => {},
  chatMessages: [],
  addChatMessage: async () => {},
  userObject: {},
  setUser: async () => {},
});

export const ContextProvider: React.FC<ContextProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [location, setLocationArray] = useState<LocationObjectCoords | null>(
    null
  );
  const [localRestaurants, setRestaurantsArray] = useState<Restaurant[]>([]);
  const [favouriteRestaurants, setFavouriteRestaurants] = useState<
    Restaurant[]
  >([]);
  const [bookmarkedRestaurants, setBookmarkedRestaurants] = useState<
    Restaurant[]
  >([]);
  const [visitedRestaurants, setVisitedRestaurants] = useState<Restaurant[]>(
    []
  );

  const [defaultMessage, setDefaultMessage] = useState<IMessage>({});
  const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
  const [authUser, setAuthUser] = useState<AuthUser>({} as AuthUser);
  const [userObject, setUserObject] = useState<User>({});

  const setRestaurants = async () => {
    setDataLoading(true);
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
    } finally {
      setDataLoading(false);
    }
  };

  const updateSaved = async () => {
    try {
      if (!user || !userObject) return;
      if (userObject.favouriteRestaurants) {
        const favourites = userObject.favouriteRestaurants.forEach(
          (restaurant) => {
            // const newRestaurant = getRestaurantById(restaurant.placeId);
            // setFavouriteRestaurants([...favouriteRestaurants, newRestaurant]);
            // setFavouriteRestaurants(favourites);
          }
        );
      }
      if (userObject.bookmarkedRestaurants) {
        const bookmarks = userObject.bookmarkedRestaurants.forEach(
          (restaurant) => {
            // const newRestaurant = getRestaurantById(restaurant.placeId);
            // setBookmarkedRestaurants([...bookmarkedRestaurants, newRestaurant]);
            // setBookmarkedRestaurants(bookmarks);
          }
        );
      }
      if (userObject.visitedRestaurants) {
        const visited = userObject.visitedRestaurants.forEach((restaurant) => {
          // const newRestaurant = getRestaurantById(restaurant.placeId);
          // setVisitedRestaurants([...visitedRestaurants, newRestaurant]);
          // setVisitedRestaurants(visited);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setUser = async () => {
    try {
      setAuthUser(user as AuthUser);
      const uid = user?.uid;
      // console.log("User UID:", uid);
      if (!uid) return;
      const favourites = await fetchFavourites(uid);
      const bookmarks = await fetchBookmarks(uid);
      const visited = await fetchVisited(uid);
      setUserObject({
        ...userObject,
        favouriteRestaurants: favourites,
        bookmarkedRestaurants: bookmarks,
        visitedRestaurants: visited,
      });
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
    dataLoading,
    setDataLoading,
    localRestaurants,
    setRestaurants,
    location,
    updateLocation,
    favouriteRestaurants,
    bookmarkedRestaurants,
    visitedRestaurants,
    updateSaved,
    defaultMessage,
    resetToDefaultMessage,
    chatMessages,
    addChatMessage,
    userObject,
    setUser,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
