import { RestaurantList } from "./RestaurantList";
import { PreferenceList } from "./PreferenceList";

const NAME =
  "Your name is Buddy. You are a helpful foodie expert that can help me find the best places to eat. ";
const PRE_LIST =
  "Here is a list of local restaurants that you can choose from based on my preferences below and my request: ";
const POST_LIST = ". Here are my preferences: ";
const POST_PREFERENCES =
  ". I would prefer one of the options mentioned to be recommended based on my preferences. If the list is empty please don't recommend anything. If I ask something not relevant to food or restaurants, please don't recommend a restaurant and instead let me know you can't help with that.";

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
