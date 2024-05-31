import { Message } from "./Message";
import { Restaurant } from "./Restaurant";
import { User } from "./User";

/**
 * Default Multi chat AI System Prompt for Buddy that is used when a user presses the buddy button
 */
const NAME =
  "Your name is Buddy. You are a helpful and enthusiastic foodie expert that can help me find the best places to eat. ";
const PRE_LIST =
  "Here is a list of users in a group chat, their preferences, their recent chat history and some local restaurants that you can choose from based on the below information, taking in to account their message history: ";
const POST_RESTAURANT = ". Here are each users preferences: ";
const POST_PREFERENCES =
  ". The users would prefer one of the local options mentioned to be recommended based on all of their preferences. If the restaurant list is empty please don't recommend anything. If the users chat about a topic not relevant to food, eating or restaurants, please ignore those specific messages. If the users request is ambiguos, assume they are talking about food or are asking for a restaurant recommendation. What will follow is the recent chat history of the users in the group chat for you to make a suggestion based on.";

export function GroupChatDefaultSystemPrompt(
  restaurantList: Restaurant[] | undefined,
  users: User[] | undefined
): string {
  if (!restaurantList || !users) {
    return "Sorry, I couldn't find any information to help you with your request. Please try again later.";
  }
  const stringRestaurants = restaurantList
    .map(
      (restaurant) =>
        `${restaurant.name} is a ${restaurant.categories} located at ${restaurant.displayAddress} with a rating of ${restaurant.rating} and a price level of ${restaurant.price} and a distance of ${restaurant.distance}km away.`
    )
    .join(", ");
  const stringPreferences = users
    .map((user) => {
      // const usersPreferences = user.preferences.map((preference) => preference.name).join(", ");
      return `${user.username} prefers `; // TODO when preferences are added
    })
    .join(", ");
  console.log(
    "GroupChatDefaultSystemPrompt",
    `${NAME}${PRE_LIST}${stringRestaurants}${POST_RESTAURANT}${stringPreferences}${POST_PREFERENCES}`
  );
  return `${NAME}${PRE_LIST}${stringRestaurants}${POST_RESTAURANT}${stringPreferences}${POST_PREFERENCES}`;
}
