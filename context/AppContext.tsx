import { ReactNode, createContext, useEffect, useRef, useState } from "react";
import { Restaurant } from "../model/Restaurant";
import { LocationObjectCoords } from "expo-location";
import { Saved } from "../model/Saved";
import fetchNearbyRestaurants from "@/controller/FetchNearbyRestaurants";
import {
  fetchBookmarks,
  fetchFavourites,
  fetchVisited,
  addFavourite,
  removeBookmark,
  removeFavourite,
  addBookmark,
  addVisited,
  fetchFriends,
  addFriend,
  removeFriend,
  fetchPreferences,
} from "@/controller/DatabaseHandler";
import * as Location from "expo-location";
import { IMessage } from "../model/AITypes";
import { DefaultAISystemPrompt } from "../model/DefaultAISystemPrompt";
import { User } from "@/model/User";
import { User as AuthUser } from "firebase/auth";
import { useAuth } from "./AuthContext";
import { Category } from "@/model/Category";
import { Friend } from "@/model/Friend";
import { getDistanceFromLatLonInKm } from "@/app/Utils/distanceCalculator";
import { PreferenceCategoryList } from "@/model/PreferenceCategoryList";
import { Sort } from "@/model/Sort";
import { SortOptions } from "@/model/SortOptions";
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
  filterRestaurants: () => void;
  distance: number;
  setDistance: (distance: number) => void;

  preferences: PreferenceCategoryList[];
  setPreferences: (prefs: PreferenceCategoryList[]) => void;
  preferencesAPINames: string[];
  setPreferencesAPINames: (names: string[]) => void;

  selectedSortOption: Sort;
  setSortOption: (sortOption: Sort) => void;
  sortRestaurants: () => void;
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
  filterRestaurants: async () => {},
  distance: 1000.0,
  setDistance: () => {},
  preferences: [],
  setPreferences: () => {},

  preferencesAPINames: [],
  setPreferencesAPINames: async () => {},

  selectedSortOption: SortOptions[0],
  setSortOption: () => {},
  sortRestaurants: async () => {},
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
  const DISTANCE_THRESHOLD = 0.1;
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
  const [preferences, setPreferences] = useState<PreferenceCategoryList[]>([]);

  const [preferencesAPINames, setPreferencesAPINames] = useState<string[]>([]);
  const [selectedSortOption, setSelectedSortOption] = useState<Sort>(
    SortOptions[0]
  );

  const setSortOption = (option: Sort) => {
    setSelectedSortOption(option);
  };
  const [distance, setDistance] = useState<number>(1000.0);



  useEffect(() => {
    const interval = setInterval(() => {
      // console.log("Checking distance...");
      checkDistanceAndUpdate();
    }, 10000); //check every 10 seconds

    return () => clearInterval(interval);
  }, [previousLocation]);

  useEffect(() => {
    const loadUserPreferences = async () => {
      if (user) {
        const prefs = await fetchPreferences();
        setUserObject({ ...userObject, preferences: prefs.preferences });
      }
    };
    loadUserPreferences();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setUserObject({
        ...userObject,
        favouriteRestaurants: favouriteRestaurants,
        bookmarkedRestaurants: bookmarkedRestaurants,
        visitedRestaurants: visitedRestaurants,
        userPreferencesAPIName: preferencesAPINames,
      });
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
  }, [searchTerm, localRestaurants]);

  useEffect(() => {
    setRestaurants();
  }, [distance]);

  useEffect(() => {
    filterRestaurants();
    sortRestaurants();
  }, [selectedSortOption, filteredRestaurants]);

  useEffect(() => {
    console.log("Friends updated");
  }, [friends]);

  useEffect(() => {
    console.log("Preferences API Names (updated NOW): ", preferencesAPINames);
  }, [preferencesAPINames]);

  useEffect(() => {
    updatePreferenceScore(localRestaurants);
    filterRestaurants();
    sortRestaurants();
  }, [preferencesAPINames, preferences]);

  useEffect(() => {
    console.log("Data loading: "+dataLoading);
  }, [dataLoading]);

  
  useEffect(() => {
    console.log(
      "Preferences (updated NOW): ",
      preferences
        .flatMap((category) =>
          category.preferences.filter((preference) => preference.selected)
        )
        .map((preference) => preference.name)
        .join(", ")
    );
  }, [preferences]);

  const setRestaurants = async () => {
    setDataLoading(true);
    try {
      await updateLocation().then(async (locationCoords) => {
        console.log("Location before fetching:", locationCoords);
        const nearbyRestaurants = await fetchNearbyRestaurants(
          locationCoords as LocationObjectCoords,
          distance
        );

        // Sort restaurants by distance (May need improving in future)
        const distanceSortedRestaurants = nearbyRestaurants.sort(
          (a, b) => a.distance - b.distance
        );

        updatePreferenceScore(nearbyRestaurants);

        setRestaurantsArray(nearbyRestaurants);
        setFilteredRestaurants(nearbyRestaurants);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setDataLoading(false);
    }
  };

  const setUser = async () => {
    try {
      setAuthUser(user as AuthUser);
      const uid = user?.uid;
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

      const prefs = await fetchPreferences();
      if (preferences) {
        setPreferences(prefs.preferences);
        setPreferencesAPINames(prefs.apiNames);
        console.log(
          "Preferences (setUser): ",
          preferencesAPINames.toLocaleString()
        );
      }
      setUserObject({
        ...userObject,
        favouriteRestaurants: favourites,
        bookmarkedRestaurants: bookmarks,
        visitedRestaurants: visited,
        userPreferencesAPIName: prefs.apiNames,
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
        filterRestaurants();
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

  const updatePreferenceScore = async (restaurants: Restaurant[]) => {
    console.log("Updating preference score...");
    restaurants.forEach((restaurant: Restaurant) => {
      if (restaurant.categories === undefined) return;
      // Reset preferenceScore
      restaurant.preferenceScore = 0;
      restaurant.categories.forEach((category) => {
        if (preferencesAPINames.includes(category)) {
          if (restaurant.preferenceScore !== undefined) {
            restaurant.preferenceScore++;
          }
        }
      });
    });
  };

  // Handle filtering of restaurants based on search term and selected category
  const filterRestaurants = () => {
    setRestaurantListIsLoading(true);
    setDataLoading(true);
    try {
      let result = localRestaurants;

      if (selectedFilters.length > 0) {
        const categoriesToFilter = new Set(
          selectedFilters
            .filter(
              (filter) =>
                ![
                  "Rating",
                  "Price",
                  "Open Status",
                  "Dietary Preference",
                  "Takeaway Option",
                ].includes(filter.type)
            )
            .map((filter) => filter.apiName)
        );

        const pricesToFilter = new Set(
          selectedFilters
            .filter((filter) => ["Price"].includes(filter.type))
            .map((filter) => filter.scale)
        );

        const ratingsToFilter = selectedFilters
          .filter((filter) => ["Rating"].includes(filter.type))
          .map((filter) => filter.rating);

        const openStatusToFilter = selectedFilters
          .filter((filter) => ["Open Status"].includes(filter.type))
          .map((filter) => filter.apiName);

        const dietsToFilter = new Set(
          selectedFilters
            .filter((filter) => ["Dietary Preference"].includes(filter.type))
            .map((filter) => filter.apiName)
        );

        // filter restaurants by the selected categories (not intersection, but union of categories)
        if (categoriesToFilter.size > 0) {
          result = result.filter((restaurant) =>
            restaurant.categories?.some((category) =>
              categoriesToFilter.has(category)
            )
          );
        }

        // Filter restaurants by the selected price level/s
        if (pricesToFilter.size > 0) {
          result = result.filter((restaurant) =>
            pricesToFilter.has(parseInt(restaurant.price ?? "null"))
          );
        }

        // Filter restaurants by the selected rating and higher
        if (ratingsToFilter.length > 0) {
          result = result.filter(
            (restaurant) =>
              restaurant.rating &&
              ratingsToFilter[0] !== undefined &&
              restaurant.rating >= ratingsToFilter[0]
          );
        }

        // Filter restaurants that are currently open
        if (openStatusToFilter.length > 0) {
          result = result.filter(
            (restaurant) =>
              restaurant.currentOpeningHours &&
              restaurant.currentOpeningHours.openNow === true
          );
        }

        // If there is a search term, filter restaurants by the search term
        if (searchTerm) {
          result = result.filter((restaurant) => {
            return restaurant.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          });
        }

        // If there is a dietary preference, filter restaurants by the dietary preference
        if (dietsToFilter.size > 0) {
          result = result.filter((restaurant) =>
            restaurant.categories?.some((category) => dietsToFilter.has(category))
          );
        }

        // Filter out Delivery and then Takeaway restaurants
        if (
          selectedFilters.some((filter) => filter.apiName === "meal_delivery")
        ) {
          result = result.filter((restaurant) =>
            restaurant.categories?.some(
              (category) => category === "meal_delivery"
            )
          );
        }
        if (
          selectedFilters.some((filter) => filter.apiName === "meal_takeaway")
        ) {
          result = result.filter((restaurant) =>
            restaurant.categories?.some(
              (category) => category === "meal_takeaway"
            )
          );
        }
        updatePreferenceScore(result);
        setFilteredRestaurants(result);
      }
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setRestaurantListIsLoading(false);
      setDataLoading(false);
    }
  };

  const sortRestaurants = async () => {
    async function sort() {
      try {
        let result = filteredRestaurants;
        switch (selectedSortOption.sortOption) {
          case "Preference":
            result = result.sort((a, b) => {
              if ((b.preferenceScore ?? 0) === (a.preferenceScore ?? 0)) {
                return a.distance.localeCompare(b.distance);
              }
              return (b.preferenceScore ?? 0) - (a.preferenceScore ?? 0);
            });
            break;
          case "Price: Low to High":
            result = result.sort((a, b) => {
              if (parseInt(a.price ?? "10") === parseInt(b.price ?? "10")) {
                return a.distance.localeCompare(b.distance);
              }
              return parseInt(a.price ?? "10") - parseInt(b.price ?? "10");
            });
            break;
          case "Price: High to Low":
            result = result.sort((a, b) => {
              if (parseInt(b.price ?? "0") === parseInt(a.price ?? "0")) {
                return a.distance.localeCompare(b.distance);
              }
              return parseInt(b.price ?? "0") - parseInt(a.price ?? "0");
            });
            break;
          case "Rating: High to Low":
            result = result.sort((a, b) => {
              if ((b.rating ?? 0) === (a.rating ?? 0)) {
                return a.distance.localeCompare(b.distance);
              }
              return (b.rating ?? 0) - (a.rating ?? 0);
            });
            break;
          case "Rating: Low to High":
            result = result.sort((a, b) => {
              if ((a.rating ?? 5) === (b.rating ?? 5)) {
                return a.distance.localeCompare(b.distance);
              }
              return (a.rating ?? 5) - (b.rating ?? 5);
            });
            break;
          case "A-Z":
            result = result.sort((a, b) => {
              if (a.name.localeCompare(b.name) === 0) {
                return a.distance.localeCompare(b.distance);
              }
              return a.name.localeCompare(b.name);
            });
            break;
          case "Z-A":
            result = result.sort((a, b) => {
              if (b.name.localeCompare(a.name) === 0) {
                return a.distance.localeCompare(b.distance);
              }
              return b.name.localeCompare(a.name);
            });
            break;
          case "Distance (Nearest)":
            result = result.sort((a, b) => a.distance.localeCompare(b.distance));
            break;
          case "Distance (Farthest)":
            result = result.sort((a, b) => b.distance.localeCompare(a.distance));
            break;
          default:
            result = result.sort((a, b) => {
              if (a.name.localeCompare(b.name) === 0) {
                return a.distance.localeCompare(b.distance);
              }
              return a.name.localeCompare(b.name);
            });
            break;
        }
        setFilteredRestaurants(result);
      }
      catch (error) {
        console.log(error);
      }
    }

    setRestaurantListIsLoading(true);
    setDataLoading(true);
    await sort();
    setRestaurantListIsLoading(false);
    setDataLoading(false);
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
    filterRestaurants,
    distance,
    setDistance,
    preferences,
    setPreferences,

    preferencesAPINames,
    setPreferencesAPINames,

    selectedSortOption,
    setSortOption,
    sortRestaurants,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
