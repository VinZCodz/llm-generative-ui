import { ChatGroq } from "@langchain/groq"

export const model = new ChatGroq({
    model: process.env.MODEL!,
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
})