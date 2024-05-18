import { Saved } from "./Saved";
import { Friend } from "./Friend";

export interface User {
    username?: string;
    uid?: string;
    friends?: Friend[];
    bookmarkedRestaurants?: Saved[];
    visitedRestaurants?: Saved[];
    favouriteRestaurants?: Saved[];
}