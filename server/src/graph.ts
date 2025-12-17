import { StateGraph } from "@langchain/langgraph"
import { MessagesState } from "./state.ts"
import * as model from "./model.ts"
import { PromptTemplate } from "@langchain/core/prompts";
import z from 'zod'

const callModel = async (state: z.infer<typeof MessagesState>) => {
    console.log(`\n\n------------CallModel--------------`);

    return state;
}

const graph = new StateGraph(MessagesState)
    .addNode("callModel", callModel)
    .addEdge("__start__", "callModel")

export const ExpenseTrackerAgent = graph.compile();