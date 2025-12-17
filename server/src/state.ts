import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

export const MessagesState = Annotation.Root({
    ...MessagesAnnotation.spec,
});