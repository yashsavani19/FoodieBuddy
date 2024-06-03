import { Saved } from "./Saved";
import { Friend } from "./Friend";
import { PreferenceCategoryList } from "./PreferenceCategoryList";

export interface User {
    username?: string;
    uid?: string;
    profileImageUrl?: string;
    friends?: Friend[];
    bookmarkedRestaurants?: Saved[];
    visitedRestaurants?: Saved[];
    favouriteRestaurants?: Saved[];
    userPreferencesAPIName?: String[];
    preferences?: PreferenceCategoryList[];
}