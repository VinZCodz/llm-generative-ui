import { ChatGroq } from "@langchain/groq";

const judgeModel = new ChatGroq({
  model: "llama-3.1-8b-instant", //TODO: need to be picked from test env
  temperature: 0
});

export const evaluateAgent = async (input: string, dbData: any, response: string, evaluationPrompt = "") => {
  const prompt = `
    Evaluate this AI Agent response based on the User Input and the Database Record.

    Present Input: "${input}"
    Present DB state: ${JSON.stringify(dbData)}

    Agent Response: "${response}"

    Criteria: "${evaluationPrompt}
    
    Output JSON only: {"pass": boolean, "reason": "concise explanation"}
  `;//TODO: Structured O/P

  const result = await judgeModel.invoke(prompt);
  return JSON.parse(result.content as string);
}
