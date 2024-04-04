import axios from "axios";
import { OPENAI_API_KEY, OPENAI_ORG_ID } from "@env";

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
              content: "You are a helpful assistant. Your name is Buddy.",
            },
            {
              role: "user",
              content: message,
            },
          ],
        },
        {
          headers: {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${this.apiKey}`,
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
