import { ReactNode, createContext, useEffect, useState } from "react";
import { Restaurant } from "../model/Restaurant";
import { LocationObjectCoords } from "expo-location";
import { Saved } from "../model/Saved";
import fetchNearbyRestaurants from "@/controller/FetchNearbyRestaurants";
import {
  fetchBookmarks,
  fetchFavourites,
  fetchVisited,
  fetchUser,
} from "@/controller/DatabaseHandler";
import * as Location from "expo-location";
import { IMessage } from "../model/AITypes";
import { DefaultAISystemPrompt } from "../model/DefaultAISystemPrompt";
import { User } from "@/model/User";
import { auth } from "@/controller/FirebaseHandler";
import { Category } from "@/model/Category";
import { categories } from "@/assets/data/categories-options";
import { Alert } from "react-native";

export type AppContextType = {
  localRestaurants: Restaurant[];
  setRestaurants: () => Promise<void>;
  location: LocationObjectCoords | null;
  updateLocation: (location: LocationObjectCoords | null) => void;
  defaultMessage: IMessage;
  resetToDefaultMessage: () => void;
  chatMessages: IMessage[];
  addChatMessage: (message: IMessage) => void;
  user: User;
  setUser: (username: string, uid: string) => Promise<void>;

  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredRestaurants: Restaurant[];
  setFilteredRestaurants: (restaurants: Restaurant[]) => void;
  showNoRestaurantsFoundAlert: () => void;
  searchFilterRestaurants: () => void;
  categoryFilterRestaurants: () => void;
};

interface ContextProviderProps {
  children: ReactNode;
}

export const AppContext = createContext<AppContextType>({
  localRestaurants: [],
  setRestaurants: async () => {},
  location: null,
  updateLocation: async () => {},
  defaultMessage: {},
  resetToDefaultMessage: async () => {},
  chatMessages: [],
  addChatMessage: async () => {},
  user: {},
  setUser: async () => {},

  selectedCategory: categories[0],
  setSelectedCategory: async () => {},
  searchTerm: "",
  setSearchTerm: async () => {},
  filteredRestaurants: [],
  setFilteredRestaurants: async () => {},
  showNoRestaurantsFoundAlert: async () => {},
  searchFilterRestaurants: async () => {},
  categoryFilterRestaurants: async () => {},
});

export const ContextProvider: React.FC<ContextProviderProps> = ({
  children,
}) => {
  const [localRestaurants, setRestaurantsArray] = useState<Restaurant[]>([]);
  const [location, setLocationArray] = useState<LocationObjectCoords | null>(
    null
  );
  const [defaultMessage, setDefaultMessage] = useState<IMessage>({});
  const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
  const [user, setUserObject] = useState<User>({});

  const [selectedCategory, setSelectedCategory] = useState<Category>(/* initial value */);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredRestaurants, setFilteredRestaurants] = useState(localRestaurants);
  const [isLoading, setIsLoading] = useState(true);
  
  const setRestaurants = async () => {
    setIsLoading(true);
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
        setFilteredRestaurants(distanceSortedRestaurants);
      });
    } catch (error) { 
      console.log(error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const setUser = async (username: string) => {
    try {
      const uid = auth.currentUser?.uid;
      const favourites = await fetchFavourites();
      console.log("Favourites:", favourites);
      // const bookmarks = await fetchBookmarks();
      // const visited = await fetchVisited();
      setUserObject({
        username: username,
        uid: uid,
        favourites: favourites,
        bookmarks: null,
        visited: null,
      } as User);
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

  // Handle filtering of restaurants based on search term and selected category
  const searchFilterRestaurants = () => {
    setIsLoading(true);
    let result = localRestaurants;

    if (searchTerm) {
      result = result.filter((restaurant) => {
        return restaurant.name && restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
  
    setFilteredRestaurants(result);
    setIsLoading(false);
  } 

  // Handle filtering of restaurants based on search term and selected category
  const categoryFilterRestaurants = () => {
    setIsLoading(true);
    let result = localRestaurants;

    if (selectedCategory && selectedCategory.name !== "All") {
      if (selectedCategory && ["Restaurant", "Bar", "Bakery", "Cafe"].includes(selectedCategory.name)) 
      {
        result = result.filter((restaurant) => {
          return restaurant.categories && restaurant.categories.map(category => category.toLowerCase()).includes(selectedCategory.name.toLowerCase());
        });
      }
      else 
      {
        result = result.filter((restaurant) => {
          return restaurant.name && restaurant.name.toLowerCase().includes(selectedCategory.name.toLowerCase());
        });
      }
    }
  
    setFilteredRestaurants(result);
    setIsLoading(false);
  } 

  const showNoRestaurantsFoundAlert = () => {
    // Show alert if no matching results
    if (!isLoading && filteredRestaurants.length === 0)
    {
      Alert.alert('No Results', 'No matching restaurants found.', [
        {
          text: 'OK',
          onPress: () => setSearchTerm('') // Clear search term
        }
      ]);
    }
    console.log(filteredRestaurants === undefined ? 'No restaurants found' : filteredRestaurants.length + ' restaurants found');
  } 

  const contextValue = {
    localRestaurants,
    setRestaurants,
    location,
    updateLocation,
    defaultMessage,
    resetToDefaultMessage,
    chatMessages,
    addChatMessage,
    user,
    setUser,
    selectedCategory: selectedCategory || {} as Category,
    setSearchTerm,
    setSelectedCategory,
    searchTerm,
    filteredRestaurants,
    setFilteredRestaurants,
    searchFilterRestaurants,
    categoryFilterRestaurants,
    showNoRestaurantsFoundAlert,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
