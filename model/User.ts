import { Saved } from "./Saved";
import { Friend } from "./Friend";
import { PreferenceList } from "./PreferenceList";

export interface User {
    username?: string;
    uid?: string;
    profileImageUrl?: string;
    friends?: Friend[];
    bookmarkedRestaurants?: Saved[];
    visitedRestaurants?: Saved[];
    favouriteRestaurants?: Saved[];
    preferences?: PreferenceList[];
}