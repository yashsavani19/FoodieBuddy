import { Friend } from "@/model/Friend";
import { PreferenceCategoryList } from "@/model/PreferenceCategoryList";
import { Restaurant } from "@/model/Restaurant";
import { Saved } from "@/model/Saved";

// Define the structure for the directions object
type Directions = {
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
};

// Navigation types to prevent "No overload matches this call" error when using navigation 
export type RootStackParamList = {
  ListView: undefined;
  Map: {
    geometry?: {
      location: {
        lat: number;
        lng: number;
      };
    };
    directions?: Directions; 
    restaurantId?: string; 
  };
  ChatScreen: { chatRoomId: string; chatRoomName?: string };
  BuddyChat: { chatRoomId: string };
  DetailsView: { Restaurant: Restaurant };
  FavoriteSpotsView: { favouriteRestaurants: Saved[] };
  BookmarkedSpotsView: { bookmarkedRestaurants: Saved[] };
  VisitedSpotsView: { visitedRestaurants: Saved[] };
  EditAccountView: undefined;
  FriendsView: undefined;
  FriendsList: undefined;
  AddFriends: undefined;
  UserProfileView: undefined;
  FriendProfile: { friend: Friend };
  FriendRequests: undefined;
  FoodPreferencesView: { preferences: PreferenceCategoryList[] };
};

// Define the MapRouteParams type to include geometry, directions, and restaurantId
export type MapRouteParams = {
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  directions?: Directions; 
  restaurantId?: string;
};
