import { Friend } from "@/model/Friend";
import { Restaurant } from "@/model/Restaurant";
import { Saved } from "@/model/Saved";

// Navigation types to prevent "No overload matches this call" error when using navigation 
export type RootStackParamList = {
  ListView: undefined;
  Map: { geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  }; };
  ChatView: undefined;
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
};

export type MapRouteParams = {
    geometry?: {
        location: {
          lat: number;
          lng: number;
        };
      };    
  };