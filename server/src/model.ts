import { ChatGroq } from "@langchain/groq"

export const llm = new ChatGroq({
    model: process.env.MODEL!,
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
})