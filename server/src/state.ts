import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

export const State = Annotation.Root({
    ...MessagesAnnotation.spec,
});