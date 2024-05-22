import { Saved } from "./Saved";
import { Friend } from "./Friend";
import { PreferenceList } from "./PreferenceList";
import { Preference } from "./Preference";

export interface User {
    username?: string;
    uid?: string;
    friends?: Friend[];
    bookmarkedRestaurants?: Saved[];
    visitedRestaurants?: Saved[];
    favouriteRestaurants?: Saved[];
    foodPreferences?: Preference[];
}