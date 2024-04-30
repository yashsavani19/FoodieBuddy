import { Saved } from "./Saved";

export interface User {
    username?: string;
    uid?: string;
    bookmarkedRestaurants?: Saved[];
    visitedRestaurants?: Saved[];
    favouriteRestaurants?: Saved[];
}