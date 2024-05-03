// Purpose: Define types for AI messages and OpenAI API requests.
export interface IMessage {
    role?: 'user' | 'assistant' | 'system';
    content?: string;
};

// Define the OpenAI request payload
export interface IOpenAIRequestPayload {
    prompt: string;
    max_tokens: number;
    temperature: number;
};

// Define the OpenAI response
export interface IOpenAIResponse {
    choices: {
        message: IMessage;
    }[];
};