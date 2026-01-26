import { StateGraph, MemorySaver } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage } from "@langchain/core/messages";
import { MessagesState } from "./state";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { StructuredTool, ToolMessage } from "langchain";

export const createExpenseTracker = ({ llm, tools, systemPrompt, checkpointer }: AgentDependencies) => {
    const callModel = async (state: typeof MessagesState.State) => {
        const llmWithTools = llm.bindTools!(tools);

        const response = await llmWithTools.invoke([
            { role: "system", content: systemPrompt },
            ...state.messages
        ]);

        return { messages: [response] };
    };

    const toolNode = new ToolNode(tools);

    const shouldCallTool = (state: typeof MessagesState.State) => {
        const lastMessage = state.messages.at(-1) as AIMessage;
        return (lastMessage?.tool_calls?.length ?? 0) > 0
            ? "toolNode"
            : "__end__";
    };

    const shouldCallModel = (state: typeof MessagesState.State) => {
        const lastMessage = state.messages.at(-1) as ToolMessage;
        return (lastMessage?.name !== 'generateChart') 
            ? "callModel"
            : "__end__";
    };

    return new StateGraph(MessagesState)
        .addNode("callModel", callModel)
        .addNode("toolNode", toolNode)
        .addEdge("__start__", "callModel")
        .addConditionalEdges("callModel", shouldCallTool)
        .addConditionalEdges("toolNode", shouldCallModel)
        .compile({ checkpointer });
};

export type AgentDependencies = {
    llm: BaseChatModel;
    tools: StructuredTool[];
    systemPrompt: string;
    checkpointer: MemorySaver;
};