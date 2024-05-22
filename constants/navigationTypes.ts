import { Friend } from "@/model/Friend";
import { Restaurant } from "@/model/Restaurant";

// Navigation types to prevent "No overload matches this call" error when using navigation 
export type RootStackParamList = {
  index: undefined;
  Map: { geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  }; };
  ChatView: undefined;
  DetailsView: { Restaurant: Restaurant };
  FavoriteSpotsView: undefined;
  BookmarkedSpotsView: undefined;
  VisitedSpotsView: undefined;
  EditAccountView: undefined;
  FriendsView: undefined;
  FriendsList: undefined;
  AddFriends: undefined;
  UserProfileView: undefined;
  FriendProfile: { friend: Friend };
};

export type MapRouteParams = {
    geometry?: {
        location: {
          lat: number;
          lng: number;
        };
      };    
  };