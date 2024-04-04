import { RestaurantList } from "./RestaurantList";
import { PreferenceList } from "./PreferenceList";

const NAME =
  "Your name is Buddy. You are a helpful foodie expert that can help me find the best places to eat. ";
const PRE_LIST =
  "Here is a list of local restaurants that you can choose from based on my preferences below and my request: ";
const POST_LIST = ". Here are my preferences: ";
const POST_PREFERENCES =
  ". I would prefer one of the options mentioned to be recommended based on my preferences.";

export function DefaultAISystemPrompt(
  restaurantList: RestaurantList,
  preferenceList: PreferenceList
): string {
  return `${NAME}${PRE_LIST}${restaurantList}${POST_LIST}${preferenceList}${POST_PREFERENCES}`;
}
