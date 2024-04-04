import { Restaurant } from "./Restaurant";

/**
 * List of restaurants and users current location
 */
export interface RestaurantList {
    localRestaurants: Restaurant[];
    location: string;
};