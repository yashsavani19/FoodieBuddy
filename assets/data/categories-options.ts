import { Category } from "@/model/Category";
import StarRating from "@/components/StarRating";

export const categories: Category[] = [

  // Cuisine Types //
  {
    id: 1,
    name: "American",
    type: "Cuisine Type",
    apiName: "american_restaurant",
  },
  {
    id: 2,
    name: "Brazilian",
    type: "Cuisine Type",
    apiName: "brazilian_restaurant",
  },
  {
    id: 3,
    name: "Chinese",
    type: "Cuisine Type",
    apiName: "chinese_restaurant",
  },
  {
    id: 4,
    name: "French",
    type: "Cuisine Type",
    apiName: "french_restaurant",
  },
  {
    id: 5,
    name: "Greek",
    type: "Cuisine Type",
    apiName: "greek_restaurant",
  },
  {
    id: 6,
    name: "Indian",
    type: "Cuisine Type",
    apiName: "indian_restaurant",
  },
  {
    id: 7,
    name: "Indonesian",
    type: "Cuisine Type",
    apiName: "indonesian_restaurant",
  },
  {
    id: 8,
    name: "Italian",
    type: "Cuisine Type",
    apiName: "italian_restaurant",
  },
  {
    id: 9,
    name: "Japanese",
    type: "Cuisine Type",
    apiName: "japanese_restaurant",
  },
  {
    id: 10,
    name: "Korean",
    type: "Cuisine Type",
    apiName: "korean_restaurant",
  },
  {
    id: 11,
    name: "Lebanese",
    type: "Cuisine Type",
    apiName: "lebanese_restaurant",
  },
  {
    id: 12,
    name: "Mediterranian",
    type: "Cuisine Type",
    apiName: "mediterranian_restaurant",
  },
  {
    id: 13,
    name: "Mexican",
    type: "Cuisine Type",
    apiName: "mexican_restaurant",
  },
  {
    id: 14,
    name: "Middle eastern",
    type: "Cuisine Type",
    apiName: "middle_eastern_restaurant",
  },
  {
    id: 15,
    name: "Spanish",
    type: "Cuisine Type",
    apiName: "spanish_restaurant",
  },
  {
    id: 16,
    name: "Thai",
    type: "Cuisine Type",
    apiName: "thai_restaurant",
  },
  {
    id: 17,
    name: "Turkish",
    type: "Cuisine Type",
    apiName: "turkish_restaurant",
  },
  {
    id: 18,
    name: "Vietnamese",
    type: "Cuisine Type",
    apiName: "vietnamese_restaurant",
  },

  // Food Categories //
  {
    id: 19,
    name: "Barbecue",
    type: "Food Category",
    apiName: "barbecue_restaurant",
  },
  {
    id: 20,
    name: "Breakfast",
    type: "Food Category",
    apiName: "breakfast_restaurant",
  },
  {
    id: 21,
    name: "Brunch",
    type: "Food Category",
    apiName: "brunch_restaurant",
  },
  {
    id: 22,
    name: "Burger",
    type: "Food Category",
    apiName: "hamburger_restaurant",
  },
  {
    id: 23,
    name: "Ice cream",
    type: "Food Category",
    apiName: "ice_cream_shop",
  },
  {
    id: 24,
    name: "Pizza",
    type: "Food Category",
    apiName: "pizza_restaurant",
  },
  {
    id: 25,
    name: "Ramen",
    type: "Food Category",
    apiName: "ramen_restaurant",
  },
  {
    id: 26,
    name: "Sandwich",
    type: "Food Category",
    apiName: "sandwich_shop",
  },
  {
    id: 27,
    name: "Seafood",
    type: "Food Category",
    apiName: "seafood_restaurant",
  },
  {
    id: 28,
    name: "Steak",
    type: "Food Category",
    apiName: "steak_house",
  },
  {
    id: 29,
    name: "Sushi",
    type: "Food Category",
    apiName: "sushi_restaurant",
  },

  // Eating Spot Types //
  {
    id: 30,
    name: "Bar",
    type: "Eating Spot Type",
    apiName: "bar",
  },
  {
    id: 31,
    name: "Cafe",
    type: "Eating Spot Type",
    apiName: "cafe",
  },
  {
    id: 32,
    name: "Coffee Shop",
    type: "Eating Spot Type",
    apiName: "coffee_shop",
  },
  {
    id: 33,
    name: "Fast food",
    type: "Eating Spot Type",
    apiName: "fast_food_restaurant",
  },
  {
    id: 34,
    name: "Restaurant",
    type: "Eating Spot Type",
    apiName: "restaurant",
  },
  
  // Dietary Preferences //
  {
    id: 35,
    name: "Vegan",
    type: "Dietary Preference",
    apiName: "vegan_restaurant",
  },
  {
    id: 36,
    name: "Vegetarian",
    type: "Dietary Preference",
    apiName: "vegetarian_restaurant",
  },

  // Prices //
  {
    id: 37,
    name: "$",
    type: "Price",
    apiName: "PRICE_LEVEL_INEXPENSIVE",
    scale: 1,
  },
  {
    id: 38,
    name: "$$",
    type: "Price",
    apiName: "PRICE_LEVEL_MODERATE",
    scale: 2,
  },
  {
    id: 39,
    name: "$$$",
    type: "Price",
    apiName: "PRICE_LEVEL_EXPENSIVE",
    scale: 3,
  },
  {
    id: 40,
    name: "$$$$",
    type: "Price",
    apiName: "PRICE_LEVEL_VERY_EXPENSIVE",
    scale: 4,
  },
  
  // Ratings //
  {
    id: 41,
    name: "1/5",
    type: "Rating",
    rating: 1.0,
  },
  {
    id: 42,
    name: "2/5",
    type: "Rating",
    rating: 2.0,
  },
  {
    id: 43,
    name: "3/5",
    type: "Rating",
    rating: 3.0,
  },
  {
    id: 44,
    name: "4/5",
    type: "Rating",
    rating: 4.0,
  },
  {
    id: 45,
    name: "5/5",
    type: "Rating",
    rating: 5.0,
  },

  // Open Status //
  {
    id: 46,
    name: "Open Now",
    type: "Open Status",
    apiName: "currentOpeningHours",
  },

  // Takeaway Options //
  {
    id: 47,
    name: "Delivery",
    type: "Takeaway Option",
    apiName: "meal_delivery",
  },
  {
    id: 48,
    name: "Takeaway",
    type: "Takeaway Option",
    apiName: "meal_takeaway",
  },
];
