import axios from "axios";
import { DefaultAISystemPrompt } from "@/model/DefaultAISystemPrompt";
import { OPENAI_API_KEY, OPENAI_ORG_ID } from "@env";
import { IMessage } from "@/model/AITypes";
import { preferenceList, restaurantList } from "@/constants/AITestData";

/**
 * Handler for OpenAI API, sends and receives messages to OpenAI
 * @param apiKey API key for OpenAI
 * @param completionURL URL for OpenAI completions
 * @param organisation Organisation ID for OpenAI
 * @param restaurantList List of restaurants
 * @param preferenceList List of preferences
 * @returns Message received from OpenAI
 * @throws Error if message cannot be sent to OpenAI
 */
class OpenAIHandler {
  private apiKey: string = OPENAI_API_KEY;
  private completionURL: string = "https://api.openai.com/v1/chat/completions";
  private organisation: string = OPENAI_ORG_ID;
  private messages: IMessage[] = [];

  constructor() {
    this.messages.push({
      role: "system",
      content: DefaultAISystemPrompt(restaurantList, preferenceList),
    });
  }

  public resetMessages() {
    this.messages = [];
    this.messages.push({
      role: "system",
      content: DefaultAISystemPrompt(restaurantList, preferenceList),
    });
  }

  async sendMessage(message: string): Promise<string> {
    this.messages.push({ role: "user", content: message });
    if (this.messages.length > 11) {
      this.messages = [this.messages[0], ...this.messages.slice(-10)];
    }

    try {
      const response = await axios.post(
        `${this.completionURL}`,
        {
          model: "gpt-3.5-turbo",
          messages: this.messages,
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
      this.messages.push({ role: "assistant", content: messageReceived });
      console.log("All messages", this.messages);
      return messageReceived;
    } catch (error) {
      console.error("Error sending messsage to OpenAI", error);
      return "There was an error communicating with AI. Please try again.";
    }
  }
}

export default OpenAIHandler;
