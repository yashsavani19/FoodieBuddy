import { ReactNode, createContext, useEffect, useRef, useState } from "react";
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
  addFavourite,
  removeBookmark,
  removeFavourite,
  addBookmark,
  addVisited,
  fetchFriends,
  addFriend,
  removeFriend,
} from "@/controller/DatabaseHandler";
import * as Location from "expo-location";
import { IMessage } from "../model/AITypes";
import { DefaultAISystemPrompt } from "../model/DefaultAISystemPrompt";
import { User } from "@/model/User";
import { User as AuthUser } from "firebase/auth";
import { useAuth } from "./AuthContext";
import { Category } from "@/model/Category";
import { categories } from "@/assets/data/categories-options";
import { Alert } from "react-native";
import { getRestaurantById } from "@/controller/FetchRestaurantById";
import { Friend } from "@/model/Friend";
import { getDistanceFromLatLonInKm } from "@/app/Utils/distanceCalculator";

export type AppContextType = {
  dataLoading: boolean;
  setDataLoading: (loading: boolean) => void;
  restaurantListIsLoading: boolean;
  setRestaurantListIsLoading: (loading: boolean) => void;
  localRestaurants: Restaurant[];
  setRestaurants: () => Promise<void>;
  favouriteRestaurants: Saved[];
  addFavouriteContext: (restaurant: Restaurant) => Promise<void>;
  removeFavouriteContext: (placeId: string) => Promise<void>;
  bookmarkedRestaurants: Saved[];
  addBookmarkContext: (restaurant: Restaurant) => Promise<void>;
  removeBookmarkContext: (placeId: string) => Promise<void>;
  visitedRestaurants: Saved[];
  addVisitedContext: (restaurant: Restaurant) => Promise<void>;
  removeVisitedContext: (placeId: string) => Promise<void>;
  location: LocationObjectCoords | null;
  updateLocation: (location: LocationObjectCoords | null) => void;
  defaultMessage: IMessage;
  resetToDefaultMessage: () => void;
  chatMessages: IMessage[];
  addChatMessage: (message: IMessage) => void;
  userObject: User;
  setUser: () => Promise<void>;
  friends: Friend[];
  addFriendContext: (friend: Friend) => Promise<void>;
  removeFriendContext: (friend: Friend) => Promise<void>;
  getFriends: () => Promise<void>;
  selectedFilters: Category[];
  setSelectedFilters: (category: Category[]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredRestaurants: Restaurant[];
  setFilteredRestaurants: (restaurants: Restaurant[]) => void;
  showNoRestaurantsFoundAlert: () => void;
  // searchFilterRestaurants: () => void;
  filterRestaurants: () => void;
  isInputDisabled: boolean;
  setIsInputDisabled: (disabled: boolean) => void;
};

interface ContextProviderProps {
  children: ReactNode;
}

export const AppContext = createContext<AppContextType>({
  dataLoading: true,
  setDataLoading: () => {},
  restaurantListIsLoading: true,
  setRestaurantListIsLoading: () => {},
  localRestaurants: [],
  setRestaurants: async () => {},
  favouriteRestaurants: [],
  addFavouriteContext: async () => {},
  removeFavouriteContext: async () => {},
  bookmarkedRestaurants: [],
  addBookmarkContext: async () => {},
  removeBookmarkContext: async () => {},
  visitedRestaurants: [],
  addVisitedContext: async () => {},
  removeVisitedContext: async () => {},
  location: null,
  updateLocation: async () => {},
  defaultMessage: {},
  resetToDefaultMessage: async () => {},
  chatMessages: [],
  addChatMessage: async () => {},
  userObject: {},
  setUser: async () => {},
  friends: [],
  addFriendContext: async () => {},
  removeFriendContext: async () => {},
  getFriends: async () => {},

  selectedFilters: [],
  setSelectedFilters: async () => {},
  searchTerm: "",
  setSearchTerm: async () => {},
  filteredRestaurants: [],
  setFilteredRestaurants: async () => {},
  showNoRestaurantsFoundAlert: async () => {},
  // searchFilterRestaurants: async () => {},
  filterRestaurants: async () => {},
  isInputDisabled: false,
  setIsInputDisabled: async () => {},
});

export const ContextProvider: React.FC<ContextProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [location, setLocationArray] = useState<LocationObjectCoords | null>(
    null
  );
  const [previousLocation, setPreviousLocation] =
    useState<LocationObjectCoords | null>(null);
  const DISTANCE_THRESHOLD = 0.1; // 100 metres
  const [localRestaurants, setRestaurantsArray] = useState<Restaurant[]>([]);
  const [favouriteRestaurants, setFavouriteRestaurants] = useState<Saved[]>([]);
  const [bookmarkedRestaurants, setBookmarkedRestaurants] = useState<Saved[]>(
    []
  );
  const [visitedRestaurants, setVisitedRestaurants] = useState<Saved[]>([]);

  const [defaultMessage, setDefaultMessage] = useState<IMessage>({});
  const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
  const [authUser, setAuthUser] = useState<AuthUser>({} as AuthUser);
  const [userObject, setUserObject] = useState<User>({});
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredRestaurants, setFilteredRestaurants] =
    useState(localRestaurants);
  const [restaurantListIsLoading, setRestaurantListIsLoading] = useState(true);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

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
        setFilteredRestaurants(distanceSortedRestaurants);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // console.log("Checking distance...");
      checkDistanceAndUpdate();
    }, 10000); //check every 10 seconds

    return () => clearInterval(interval);
  }, [previousLocation]);

  useEffect(() => {
    if (!user) {
      setUserObject({});
    }
  }, [user]);

  useEffect(() => {
    console.log("Favourites updated");
  }, [favouriteRestaurants]);
  useEffect(() => {
    console.log("Bookmarks updated");
  }, [bookmarkedRestaurants]);
  useEffect(() => {
    console.log("Visited updated");
  }, [visitedRestaurants]);

  useEffect(() => {
    filterRestaurants();  
  }, [searchTerm]);
  useEffect(() => {
    console.log("Friends updated");
  }, [friends]);

  const setUser = async () => {
    try {
      setAuthUser(user as AuthUser);
      const uid = user?.uid;
      // console.log("User UID:", uid);
      if (!uid) return;
      const favourites = await fetchFavourites();
      if (favourites) {
        setFavouriteRestaurants(favourites);
      }
      const bookmarks = await fetchBookmarks();
      if (bookmarks) {
        setBookmarkedRestaurants(bookmarks);
      }
      const visited = await fetchVisited();
      if (visited) {
        setVisitedRestaurants(visited);
      }
      setUserObject({
        ...userObject,
        favouriteRestaurants: favourites,
        bookmarkedRestaurants: bookmarks,
        visitedRestaurants: visited,
      });
      getFriends();
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
        let newLocation = await Location.getCurrentPositionAsync({});
        setLocationArray(newLocation.coords);
        console.log("Location updated:", location);
        resolve(newLocation.coords);
      } catch (error) {
        console.error("Error updating location:", error);
        reject(error);
      }
    });
  };

  const checkDistanceAndUpdate = async () => {
    const tempLocation = await updateLocation().then((locationCoords) => {
      return locationCoords as LocationObjectCoords;
    });
    if (previousLocation) {
      const distance = getDistanceFromLatLonInKm(
        previousLocation.latitude,
        previousLocation.longitude,
        tempLocation.latitude,
        tempLocation.longitude
      );
      if (distance > DISTANCE_THRESHOLD) {
        console.log("Distance threshold exceeded. Updating restaurants...");
        setRestaurants();
        setPreviousLocation(tempLocation);
      }
    } else {
      setPreviousLocation(tempLocation);
    }
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
  // const searchFilterRestaurants = () => {
  //   setRestaurantListIsLoading(true);
  //   let result = localRestaurants;

  //   // This prevents the restaurant list from being reset to the full list instead of filtered list every time a key is typed in search
  //   // This happened before another category was selected...
  //   if (!selectedFilters) {
  //     setSelectedFilters([]);
  //   }

  //   setFilteredRestaurants(result);
  //   setRestaurantListIsLoading(false);
  // };

  // Handle filtering of restaurants based on search term and selected category
  const filterRestaurants = () => {
    setRestaurantListIsLoading(true);
    let result = localRestaurants;
  
    if (selectedFilters) {
      const categoriesToFilter = new Set(selectedFilters
        .filter(filter => !["Rating","Price","Open Status"].includes(filter.type))
        .map(filter => filter.apiName));

      const pricesToFilter = new Set(selectedFilters
        .filter(filter => ["Price"].includes(filter.type))
        .map(filter => filter.scale));

      const ratingsToFilter = selectedFilters
        .filter(filter => ["Rating"].includes(filter.type))
        .map(filter => filter.rating)

      const openStatusToFilter = selectedFilters
        .filter(filter => ["Open Status"].includes(filter.type))
        .map(filter => filter.apiName)

      // filter restaurants by the selected categories (not intersection, but union of categories)
      if (categoriesToFilter.size > 0) {
        result = result.filter(restaurant =>
          restaurant.categories?.some(category => categoriesToFilter.has(category))
        );
      }

      // Filter restaurants by the selected price level/s
      if (pricesToFilter.size > 0) {
        result = result.filter(restaurant =>
          pricesToFilter.has(parseInt(restaurant.price ?? 'null'))
        );
      }

      // Filter restaurants by the selected rating and higher
      if (ratingsToFilter.length > 0) {
        result = result.filter(restaurant =>
          restaurant.rating && ratingsToFilter[0] !== undefined && restaurant.rating >= ratingsToFilter[0]
        );
      }

      // Filter restaurants that are currently open
      if (openStatusToFilter.length > 0) {
        result = result.filter(restaurant =>
          restaurant.currentOpeningHours && restaurant.currentOpeningHours.openNow === true
        );
      }

      if (searchTerm) {
        result = result.filter((restaurant) => {
          return restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
        });
      }
    
      setFilteredRestaurants(result);
      // console.log("Filtered restaurants:", result);
      setRestaurantListIsLoading(false);
    }
  };

  const [alertShown, setAlertShown] = useState(false);
  //const [lastValidSearchTerm, setLastValidSearchTerm] = useState('');

  const showNoRestaurantsFoundAlert = () => {
    // Show alert if no matching results
    if (
      !restaurantListIsLoading &&
      filteredRestaurants.length === 0 &&
      !alertShown
    ) {
      Alert.alert("No Results", "No matching restaurants found.", [
        {
          text: "OK",
          //onPress: () => setSearchTerm(lastValidSearchTerm) // Clear search term
        },
      ]);
      //setIsInputDisabled(true);
      setAlertShown(true);
    } else if (filteredRestaurants.length > 0) {
      //setIsInputDisabled(false);
      //setLastValidSearchTerm(searchTerm);
      setAlertShown(false);
    }
    console.log(
      filteredRestaurants === undefined
        ? "No restaurants found"
        : filteredRestaurants.length + " restaurants found"
    );
  };

  const addFavouriteContext = async (restaurant: Restaurant) => {
    try {
      if (!user || !userObject) return;
      await addFavourite(restaurant);
      const newFavourite = {
        restaurant,
        addedOn: new Date(),
      };
      setFavouriteRestaurants([...favouriteRestaurants, newFavourite]);
      // setUser();
    } catch (error) {
      console.log(error);
    }
  };

  const removeFavouriteContext = async (placeId: string) => {
    try {
      if (!user || !userObject) return;
      const newFavourites = favouriteRestaurants.filter(
        (item) => item.restaurant.id !== placeId
      );
      setFavouriteRestaurants(newFavourites);
      await removeFavourite(placeId);
      // setUser();
    } catch (error) {
      console.log(error);
    }
  };

  const addBookmarkContext = async (restaurant: Restaurant) => {
    try {
      if (!user || !userObject) return;
      await addBookmark(restaurant);
      const newBookmark = {
        restaurant,
        addedOn: new Date(),
      };
      setBookmarkedRestaurants([...bookmarkedRestaurants, newBookmark]);
      // setUser();
    } catch (error) {
      console.log(error);
    }
  };

  const removeBookmarkContext = async (placeId: string) => {
    try {
      if (!user || !userObject) return;
      const newBookmarks = bookmarkedRestaurants.filter(
        (item) => item.restaurant.id !== placeId
      );
      setBookmarkedRestaurants(newBookmarks);
      await removeBookmark(placeId);
      // setUser();
    } catch (error) {
      console.log(error);
    }
  };

  const addVisitedContext = async (restaurant: Restaurant) => {
    try {
      if (!user || !userObject) return;
      await addVisited(restaurant);
      const newVisited = {
        restaurant,
        addedOn: new Date(),
      };
      setVisitedRestaurants([...visitedRestaurants, newVisited]);
      // setUser();
    } catch (error) {
      console.log(error);
    }
  };

  const removeVisitedContext = async (placeId: string) => {
    try {
      if (!user || !userObject) return;
      const newVisited = visitedRestaurants.filter(
        (item) => item.restaurant.id !== placeId
      );
      setVisitedRestaurants(newVisited);
      // setUser();
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch friends from database and add to context
  const getFriends = async () => {
    const friends = await fetchFriends();
    if (friends) {
      setFriends(friends);
    }
  };

  const addFriendContext = async (friend: Friend) => {
    try {
      if (!user || !userObject) return;
      const newFriends = [...friends, friend];
      await addFriend(friend);
      setFriends(newFriends);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFriendContext = async (friend: Friend) => {
    try {
      if (!user || !userObject) return;
      const newFriends = friends.filter((item) => item.uid !== friend.uid);
      setFriends(newFriends);
      await removeFriend(friend);
    } catch (error) {
      console.log(error);
    }
  };

  const contextValue = {
    dataLoading,
    setDataLoading,
    restaurantListIsLoading,
    setRestaurantListIsLoading,
    localRestaurants,
    setRestaurants,
    location,
    updateLocation,
    favouriteRestaurants,
    addFavouriteContext,
    removeFavouriteContext,
    bookmarkedRestaurants,
    addBookmarkContext,
    removeBookmarkContext,
    visitedRestaurants,
    addVisitedContext,
    removeVisitedContext,
    defaultMessage,
    resetToDefaultMessage,
    chatMessages,
    addChatMessage,
    userObject,
    setUser,
    friends,
    addFriendContext,
    removeFriendContext,
    getFriends,
    selectedFilters: selectedFilters || ([] as Category[]),
    setSearchTerm,
    setSelectedFilters,
    searchTerm,
    filteredRestaurants,
    setFilteredRestaurants,
    // searchFilterRestaurants,
    filterRestaurants,
    showNoRestaurantsFoundAlert,
    isInputDisabled,
    setIsInputDisabled,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
