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
import { GOOGLE_API_KEY } from "@env";
import axios from "axios";

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

  const getRestaurantById = async (placeId: string): Promise<any | null> => {
    try {
      // Construct the URL for fetching restaurant details
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website&key=${GOOGLE_API_KEY}`;
  
      // Make a GET request to fetch restaurant details
      const response = await axios.get<any>(detailsUrl);
  
      // Extract relevant data from the response
      const restaurantDetails = response.data.result;
      if (!restaurantDetails) {
        console.error(`Restaurant details not found for place ID: ${placeId}`);
        return null;
      }
  
      // Construct the restaurant object with extracted data
      const restaurant = {
        id: placeId,
        name: restaurantDetails.name,
        displayAddress: restaurantDetails.formatted_address,
        phone: restaurantDetails.formatted_phone_number,
        website: restaurantDetails.website,
      };
  
      return restaurant;
    } catch (error) {
      console.error(`Error fetching restaurant details for place ID: ${placeId}`, error);
      return null;
    }
  };

  const updateSaved = async () => {
    try {
      if (!user || !userObject) return;
  
      // Update favourite restaurants
      if (userObject.favouriteRestaurants) {
        console.log("Updating favourite restaurants...");
        const favouritePromises = userObject.favouriteRestaurants.map(async (restaurant) => {
          try {
            const newRestaurant = await getRestaurantById(restaurant.placeId);
            return newRestaurant;
          } catch (error) {
            console.error("Error fetching favourite restaurant:", error);
            return null;
          }
        });
        const favouriteRestaurants = await Promise.all(favouritePromises);
        console.log("Favourite restaurants updated:", favouriteRestaurants);
        setFavouriteRestaurants(favouriteRestaurants.filter((restaurant) => restaurant !== null));
      }
  
      // Update bookmarked restaurants
      if (userObject.bookmarkedRestaurants) {
        console.log("Updating bookmarked restaurants...");
        const bookmarkPromises = userObject.bookmarkedRestaurants.map(async (restaurant) => {
          try {
            const newRestaurant = await getRestaurantById(restaurant.placeId);
            return newRestaurant;
          } catch (error) {
            console.error("Error fetching bookmarked restaurant:", error);
            return null;
          }
        });
        const bookmarkedRestaurants = await Promise.all(bookmarkPromises);
        console.log("Bookmarked restaurants updated:", bookmarkedRestaurants);
        setBookmarkedRestaurants(bookmarkedRestaurants.filter((restaurant) => restaurant !== null));
      }
  
      // Update visited restaurants
      if (userObject.visitedRestaurants) {
        console.log("Updating visited restaurants...");
        const visitedPromises = userObject.visitedRestaurants.map(async (restaurant) => {
          try {
            const newRestaurant = await getRestaurantById(restaurant.placeId);
            return newRestaurant;
          } catch (error) {
            console.error("Error fetching visited restaurant:", error);
            return null;
          }
        });
        const visitedRestaurants = await Promise.all(visitedPromises);
        console.log("Visited restaurants updated:", visitedRestaurants);
        setVisitedRestaurants(visitedRestaurants.filter((restaurant) => restaurant !== null));
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
