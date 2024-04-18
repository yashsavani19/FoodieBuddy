export interface IMessage {
    role?: 'user' | 'assistant' | 'system';
    content?: string;
};

export interface IOpenAIRequestPayload {
    prompt: string;
    max_tokens: number;
    temperature: number;
};

export interface IOpenAIResponse {
    choices: {
        message: IMessage;
    }[];
};