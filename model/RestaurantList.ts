import { Restaurant } from "./Restaurant";

export interface RestaurantList {
    localRestaurants: Restaurant[];
    location: string;
};