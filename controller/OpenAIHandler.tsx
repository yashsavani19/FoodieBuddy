import axios from "axios";
import { OPENAI_API_KEY, OPENAI_ORG_ID } from "@env";
import { IMessage } from "@/model/AITypes";
import { useCallback, useState } from "react";

export function useOpenAIHandler() {
  const [systemPrompt, setSystemPromptState] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>([
    {
      role: "system",
      content: systemPrompt,
    },
  ]);

  const setSystemPrompt = useCallback((inputSystemPrompt: string) => {
    setSystemPromptState(inputSystemPrompt);
    setMessages([
      {
        role: "system",
        content: inputSystemPrompt,
      },
    ]);
    // console.log("System Prompt:", inputSystemPrompt);
  }, []);

  const resetMessages = useCallback(() => {
    setMessages([
      {
        role: "system",
        content: systemPrompt,
      },
    ]);
  }, [systemPrompt]);

  const sendMessage = useCallback(
    async (message: string): Promise<string> => {
      if (!systemPrompt) {
        throw new Error("System prompt is not set.");
      }

      try {
        const userMessage: IMessage = { role: "user", content: message };

        // Update to use functional update to always get the latest messages
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages, userMessage];
          if (newMessages.length > 11) {
            return [newMessages[0], ...newMessages.slice(-10)];
          }
          return newMessages;
        });

        // console.log("Sent Messages:", messages);

        const response = await axios.post(
          `https://api.openai.com/v1/chat/completions`,
          {
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              ...messages,
              userMessage,
            ],
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
    [systemPrompt, messages]
  );

  return { messages, sendMessage, resetMessages, setSystemPrompt };
}
