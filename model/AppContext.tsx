import { ReactNode, createContext, useState } from "react";
import { Restaurant } from "./Restaurant";
import { LocationObjectCoords } from "expo-location";
import { Saved } from "./Saved";
import fetchNearbyRestaurants from "@/controller/FetchNearbyRestaurants";
import { fetchBookmarks, fetchFavourites, fetchVisited } from "@/controller/DatabaseHandler";
import * as Location from 'expo-location';

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
});

export const ContextProvider: React.FC<ContextProviderProps> = ({
  children,
}) => {
  const [localRestaurants, setRestaurantsArray] = useState<Restaurant[]>([]);
  const [favourites, setFavouritesArray] = useState<Saved[]>([]);
  const [bookmarks, setBookmarksArray] = useState<Saved[]>([]);
  const [visited, setVisitedArray] = useState<Saved[]>([]);
  const [location, setLocationArray] = useState<LocationObjectCoords | null>(null);

  const setRestaurants = async () => {
    try {
      await updateLocation();
      await setRestaurantsArray(await fetchNearbyRestaurants(location));
    } catch (error) {
      console.log(error);
    }
  };

  const setFavourites = async () => {
    try {
      // await setFavouritesArray(await fetchFavourites())
    } catch (error) {
      console.log(error);
    }
  };

  const setBookmarks = async () => {
    try {
      // await setBookmarksArray(await fetchBookmarks())
    } catch (error) {
      console.log(error);
    }
  };

  const setVisited = async () => {
    try {
      // await setVisitedArray(await fetchVisited())
    } catch (error) {
      console.log(error);
    }
  };

  const updateLocation= async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocationArray(location.coords);
      console.log("Location updated:", location.coords);
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  const setRestaurants = async () => {
    try {
      if (!location) {
        console.log("Location is not available yet.");
        return;
      }
      console.log("Fetching restaurants for location:", location);
      const restaurants = await fetchNearbyRestaurants(location);
      setRestaurantsArray(restaurants);
      console.log("Restaurants fetched:", restaurants);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  useEffect(() => {
    updateLocation(); // This will only update the location
  }, []);

  // Separate useEffect to handle actions that depend on the updated location
  useEffect(() => {
    if (location) {
      setRestaurants(); // Fetch restaurants once the location is updated
    }
  }, [location]); // This effect depends on `location

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
    };

    return (
      <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
    );
};