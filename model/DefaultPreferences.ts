import { PreferenceCategoryList } from "./PreferenceCategoryList";

export const DefaultPreferences: PreferenceCategoryList[] = [
    {
        title: "Cuisine Types",
        preferences: [
            { name: "American", selected: false, apiName: "american_restaurant" },
            { name: "Brazilian", selected: false, apiName: "brazilian_restaurant" },
            { name: "Chinese", selected: false, apiName: "chinese_restaurant" },
            { name: "French", selected: false, apiName: "french_restaurant" },
            { name: "Indian", selected: false, apiName: "indian_restaurant" },
            { name: "Indonesian", selected: false, apiName: "indonesian_restaurant" },
            { name: "Italian", selected: false, apiName: "italian_restaurant" },
            { name: "Greek", selected: false, apiName: "greek_restaurant" },
            { name: "Japanese", selected: false, apiName: "japanese_restaurant" },
            { name: "Korean", selected: false, apiName: "korean_restaurant" },
            { name: "Lebanese", selected: false, apiName: "lebanese_restaurant" },
            { name: "Mediterranean", selected: false, apiName: "mediterranean_restaurant" },
            { name: "Mexican", selected: false, apiName: "mexican_restaurant" },
            { name: "Middle Eastern", selected: false, apiName: "middle_eastern_restaurant" },
            { name: "Spanish", selected: false, apiName: "spanish_restaurant" },
            { name: "Thai", selected: false, apiName: "thai_restaurant" },
            { name: "Turkish", selected: false, apiName: "turkish_restaurant" },
            { name: "Vietnamese", selected: false, apiName: "vietnamese_restaurant" },
        ],
    },
    {
        title: "Food Category",
        preferences: [
            { name: "Barbeque", selected: false, apiName: "barbecue_restaurant" },
            { name: "Breakfast", selected: false, apiName: "breakfast_restaurant" },
            { name: "Brunch", selected: false, apiName: "brunch_restaurant" },
            { name: "Burger", selected: false, apiName: "hamburger_restaurant" },
            { name: "Pizza", selected: false, apiName: "pizza_restaurant" },
            { name: "Ramen", selected: false, apiName: "ramen_restaurant" },
            { name: "Seafood", selected: false, apiName: "seafood_restaurant" },
            { name: "Sandwich", selected: false, apiName: "sandwich_shop" },
            { name: "Steak", selected: false, apiName: "steak_house" },
            { name: "Sushi", selected: false, apiName: "sushi_restaurant" },
            { name: "Ice Cream", selected: false, apiName: "ice_cream_shop" },
        ],
    },
    {
        title: "Eating Spot Types",
        preferences: [
            { name: "Bar", selected: false, apiName: "bar" },
            { name: "Cafe", selected: false, apiName: "cafe" },
            { name: "Coffee Shop", selected: false, apiName: "coffee_shop" },
            { name: "Fast Food", selected: false, apiName: "fast_food_restaurant" },
            { name: "Restaurant", selected: false, apiName: "restaurant" },
        ],
    },
    {
        title: "Dietary Preferences",
        preferences: [
            { name: "Vegetarian", selected: false, apiName: "vegetarian_restaurant" },
            { name: "Vegan", selected: false, apiName: "vegan_restaurant" },
        ],
    },
];
