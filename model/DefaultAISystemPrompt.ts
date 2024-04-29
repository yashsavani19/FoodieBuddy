import { Restaurant } from "./Restaurant";

/**
 * Default AI System Prompt for Buddy that is used when a user submits a request
 */
const NAME =
  "Your name is Buddy. You are a helpful and enthusiastic foodie expert that can help me find the best places to eat. ";
const PRE_LIST =
  "Here is a list of local restaurants that you can choose from based on the users preferences below and the users request: ";
const POST_LIST = ". Here are the users preferences: ";
const POST_PREFERENCES =
  ". The user would prefer one of the options mentioned to be recommended based on their preferences. If the restaurant list is empty please don't recommend anything. If the user asks about a topic not relevant to food, eating or restaurants, or is not responding to a previous message of yours please let them know you can't help with that. If the users request is ambiguos, assume they are talking about food or are asking for a restaurant recommendation.";

export function DefaultAISystemPrompt(
  restaurantList: Restaurant[]
  // preferenceList: Preference[],
): string {
  const stringRestaurants = restaurantList
    .map(
      (restaurant) =>
        `${restaurant.name} is a ${restaurant.categories} located at ${restaurant.displayAddress} with a rating of ${restaurant.rating} and a price level of ${restaurant.price} and a distance of ${restaurant.distance}km away.`
    )
    .join(", ");
  const stringPreferences = "undefined";
  // const stringPreferences = preferenceList.preferences
  //   .map((preference) => `${preference.preferenceId}`)
  //   .join(", ");
  return `${NAME}${PRE_LIST}${stringRestaurants}${POST_LIST}${stringPreferences}${POST_PREFERENCES}`;
}
