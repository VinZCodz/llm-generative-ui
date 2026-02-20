import { StateGraph } from "@langchain/langgraph";
import type { LangGraphRunnableConfig } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage } from "@langchain/core/messages";
import { MessagesState } from "./state";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { StructuredTool, ToolMessage } from "langchain";

export const expenseAgentGraphBuilder = ({ llm, tools, systemPrompt }: AgentDependencies) => {
    const callModel = async (state: typeof MessagesState.State) => {
        const llmWithTools = llm.bindTools!(tools);

        const response = await llmWithTools.invoke([
            { role: "system", content: systemPrompt },
            ...state.messages
        ]);

        return { messages: [response] };
    };

    const toolNode = new ToolNode(tools);

    const shouldCallTool = (state: typeof MessagesState.State, config: LangGraphRunnableConfig) => {
        const lastMessage = state.messages.at(-1) as AIMessage;

        if (lastMessage?.tool_calls?.length) {
            const customMessage: StreamMessage = {
                type: 'toolCall:start',
                payload: {
                    name: lastMessage.tool_calls[0]?.name!,
                    args: lastMessage.tool_calls[0]?.args!
                }
            }
            config.writer!(customMessage);

            return "toolNode";
        }
        else
            return "__end__";
    };

    const shouldCallModel = (state: typeof MessagesState.State) => {
        const lastMessage = state.messages.at(-1) as ToolMessage;
        if (lastMessage?.name === 'generateChart') {
            return "__end__";
        }
        else
            return "callModel";
    };

    return new StateGraph(MessagesState)
        .addNode("callModel", callModel)
        .addNode("toolNode", toolNode)
        .addEdge("__start__", "callModel")
        .addConditionalEdges("callModel", shouldCallTool)
        .addConditionalEdges("toolNode", shouldCallModel);
};

export type AgentDependencies = {
    llm: BaseChatModel;
    tools: StructuredTool[];
    systemPrompt: string;
};