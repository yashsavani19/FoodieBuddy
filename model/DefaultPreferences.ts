import { PreferenceList } from "./PreferenceList";

export const DefaultPreferences: PreferenceList[] = [
    {
        title: "Cuisine Types",
        preferences: [
            { name: "American", selected: false },
            { name: "Brazilian", selected: false },
            { name: "Chinese", selected: false },
            { name: "French", selected: false },
            { name: "Indian", selected: false },
            { name: "Indonesian", selected: false },
            { name: "Italian", selected: false },
            { name: "Greek", selected: false },
            { name: "Japanese", selected: false },
            { name: "Korean", selected: false },
            { name: "Lebanese", selected: false },
            { name: "Mediterranean", selected: false },
            { name: "Mexican", selected: false },
            { name: "Middle Eastern", selected: false },
            { name: "Spanish", selected: false },
            { name: "Thai", selected: false },
            { name: "Turkish", selected: false },
            { name: "Vietnamese", selected: false },
        ],
    },
    {
        title: "Food Category",
        preferences: [
            { name: "Barbeque", selected: false },
            { name: "Breakfast", selected: false },
            { name: "Brunch", selected: false },
            { name: "Burger", selected: false },
            { name: "Pizza", selected: false },
            { name: "Ramen", selected: false },
            { name: "Seafood", selected: false },
            { name: "Sandwich", selected: false },
            { name: "Steak", selected: false },
            { name: "Sushi", selected: false },
            { name: "Ice Cream", selected: false },
        ],
    },
    {
        title: "Eating Spot Types",
        preferences: [
            { name: "Bar", selected: false },
            { name: "Cafe", selected: false },
            { name: "Coffee Shop", selected: false },
            { name: "Fast Food", selected: false },
            { name: "Restaurant", selected: false },
        ],
    },
    {
        title: "Dietary Preferences",
        preferences: [
            { name: "Vegetarian", selected: false },
            { name: "Vegan", selected: false },
            { name: "Halal", selected: false },
            { name: "Gluten-Free", selected: false },
            { name: "Dairy-Free", selected: false },
            { name: "Nut-Free", selected: false },
            { name: "Kosher", selected: false },
            { name: "Pescatarian", selected: false },
        ],
    },
];
