import { RestaurantList } from "./RestaurantList";
import { PreferenceList } from "./PreferenceList";

/**
 * Default AI System Prompt for Buddy that is used when a user submits a request
 */
const NAME =
  "Your name is Buddy. You are a helpful foodie expert that can help me find the best places to eat. ";
const PRE_LIST =
  "Here is a list of local restaurants that you can choose from based on the users preferences below and the users request: ";
const POST_LIST = ". Here are the users preferences: ";
const POST_PREFERENCES =
  ". The user would prefer one of the options mentioned to be recommended based on their preferences. If the list is empty please don't recommend anything. If the user asks something not relevant to food or restaurants, please avoid recommending a restaurant and instead let them know you can't help with that.";

export function DefaultAISystemPrompt(
  restaurantList: RestaurantList,
  preferenceList: PreferenceList
): string {
  const stringRestaurants = restaurantList.localRestaurants
    .map(
      (restaurant) =>
        `${restaurant.name} is a ${restaurant.categories} restaurant located at ${restaurant.displayAddress} with a rating of ${restaurant.rating}`
    )
    .join(", ");
  const stringPreferences = preferenceList.preferences
    .map((preference) => `${preference.preferenceId}`)
    .join(", ");
  return `${NAME}${PRE_LIST}${stringRestaurants}${POST_LIST}${stringPreferences}${POST_PREFERENCES}`;
}
