import { MemorySaver, StateGraph } from "@langchain/langgraph"
import { MessagesState } from "./state.ts"
import { llm } from "./model.ts"
import { SYSTEM_PROMPT } from "./prompt.ts"
import { initTools } from "./tools.ts";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage } from "@langchain/core/messages";

import { ExpenseService } from "./services/ExpenseService.ts";
import { db } from "./db/client.ts";
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as expense from './db/schema/expenses.ts';

const expenseService = new ExpenseService(db as unknown as LibSQLDatabase<typeof expense>)
const tools = initTools(expenseService)

const callModel = async (state: typeof MessagesState.State) => {
    const llmWithTools = llm.bindTools(tools);
    const response = await llmWithTools.invoke([
        { role: "system", content: SYSTEM_PROMPT },
        ...state.messages
    ]);

    return { messages: [response] };
}

const toolNode = new ToolNode(tools);

const shouldContinue = (state: typeof MessagesState.State) => {
    const lastMessage = state.messages.at(-1);
    if (lastMessage == null || !AIMessage.isInstance(lastMessage))
        return "__end__";

    if (lastMessage.tool_calls?.length) {
        return "toolNode";
    }

    return "__end__";
}


const graph = new StateGraph(MessagesState)
    .addNode("callModel", callModel)
    .addNode("toolNode", toolNode)
    .addEdge("__start__", "callModel")
    .addConditionalEdges("callModel", shouldContinue)

export const ExpenseTrackerAgent = graph.compile({ checkpointer: new MemorySaver() });