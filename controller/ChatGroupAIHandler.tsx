import axios from "axios";
import { GroupChatDefaultSystemPrompt } from "@/model/DefaultGroupChatAISystemPrompt";
import { OPENAI_API_KEY, OPENAI_ORG_ID } from "@env";
import { IMessage } from "@/model/AITypes";
import { useCallback, useContext, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { Message } from "@/model/Message";
import { User } from "@/model/User";

export function useGroupOpenAIHandler(users?: User[]) {
  const { localRestaurants } = useContext(AppContext);
  const [messages, setMessages] = useState<IMessage[]>([
    {
      role: "system",
      content: GroupChatDefaultSystemPrompt(localRestaurants, users),
    },
  ]);

  const resetMessages = useCallback(() => {
    setMessages([
      {
        role: "system",
        content: GroupChatDefaultSystemPrompt(localRestaurants, users),
      },
    ]);
  }, [localRestaurants]);

  const sendMessage = useCallback(
    async (groupChat: Message[]): Promise<string> => {
      const chatHistory = "";
      groupChat.map((message) => {
        chatHistory.concat(
          `User: ${message.username}. Message: ${message.text}. `
        );
      });
      console.log("Chat History:", chatHistory);
      try {
        const userMessage: IMessage = { role: "user", content: chatHistory };

        // Update to use functional update to always get the latest messages
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages, userMessage];
          if (newMessages.length > 11) {
            return [newMessages[0], ...newMessages.slice(-10)];
          }
          return newMessages;
        });
        console.log("Sent Messages:", messages);

        const response = await axios.post(
          `https://api.openai.com/v1/chat/completions`,
          {
            model: "gpt-3.5-turbo",
            messages: [...messages, userMessage],
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${OPENAI_API_KEY}`,
              ...(OPENAI_ORG_ID && {
                "OpenAI-Organization": OPENAI_ORG_ID,
              }),
            },
          }
        );

        const messageReceived = response.data.choices[0].message.content;
        // Use functional update form to avoid stale closure issues
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: messageReceived },
        ]);
        return messageReceived;
      } catch (error) {
        console.error("Error sending message to OpenAI", error);
        throw new Error(
          "There was an error communicating with AI. Please try again."
        );
      }
    },
    [] // Removed messages from dependencies
  );

  return { messages, sendMessage, resetMessages };
}
