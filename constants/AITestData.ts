import { Preference } from "@/model/Preference";
import { Restaurant } from "@/model/Restaurant";
import { RestaurantList } from "@/model/RestaurantList";

/**
 * Test data for the AI until the API is implemented
 */
export const restaurants: Restaurant[] = [
    {
      id: "1",
      name: "McDonalds",
      imageUrl:
        "https://www.mcdonalds.com/is/image/content/dam/usa/nfl/nutrition/items/hero/desktop/t-mcdonalds-Big-Mac.jpg",
      categories: ["Fast Food"],
      price: "$",
      rating: 4.5,
      displayAddress: "123 Main St",
      phone: "123-456-7890",
      distance: 1.2,
      isClosed: false,
    },
    {
      id: "2",
      name: "Burger King",
      imageUrl:
        "https://www.bk.com/sites/default/files/032021-Homepage-Combo-1-Logo.png",
      categories: ["Fast Food"],
      price: "$",
      rating: 4.0,
      displayAddress: "456 Elm St",
      phone: "098-765-4321",
      distance: 2.3,
      isClosed: false,
    },
    {
      id: "3",
      name: "Wendy's",
      imageUrl:
        "https://www.wendys.com/assets/q4-2020/hero/hero-breakfast-baconator.jpg",
      categories: ["Fast Food"],
      price: "$",
      rating: 4.2,
      displayAddress: "789 Oak St",
      phone: "543-210-6789",
      distance: 3.4,
      isClosed: false,
    },
  ];
  export const preferences: Preference[] = [
    { preferenceId: "Fast Food" },
    { preferenceId: "American" },
    { preferenceId: "Burgers" },
  ];
  export const preferenceList = { preferences };
  
  export const restaurantList: RestaurantList = {
    localRestaurants: restaurants,
    location: "123 Main St",
  };