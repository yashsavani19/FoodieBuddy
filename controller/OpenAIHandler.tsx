import axios from "axios";
import { DefaultAISystemPrompt } from "@/model/DefaultAISystemPrompt";
import { RestaurantList } from "@/model/RestaurantList";
import { Restaurant } from "@/model/Restaurant";
import { OPENAI_API_KEY, OPENAI_ORG_ID } from "@env";
import { Preference } from "@/model/Preference";

// Temp data for testing
const restaurants: Restaurant[] = [
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
    name: "Wendys",
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
const preferences: Preference[] = [
  { preferenceId: "Fast Food" },
  { preferenceId: "American" },
  { preferenceId: "Burgers" },
];
const preferenceList = { preferences };

const restaurantList: RestaurantList = {
  localRestaurants: restaurants,
  location: "123 Main St",
};
// End of temp data

class OpenAIHandler {
  private apiKey: string = OPENAI_API_KEY;
  private completionURL: string = "https://api.openai.com/v1/chat/completions";
  private organisation: string = OPENAI_ORG_ID;

  async sendMessage(message: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.completionURL}`,
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: DefaultAISystemPrompt(restaurantList, preferenceList),
            },
            {
              role: "user",
              content: message,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
            ...(this.organisation && {
              "OpenAI-Organization": this.organisation,
            }),
          },
        }
      );

      const messageReceived = response.data.choices[0].message.content;
      return messageReceived;
    } catch (error) {
      console.error("Error sending messsage to OpenAI", error);
    }
    return "";
  }
}

export default OpenAIHandler;
