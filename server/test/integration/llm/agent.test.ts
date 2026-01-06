import { HumanMessage } from "langchain";
import { expenseTable } from '../../../src/db/schema/expenses.ts';
import { testDb, ExpenseAgent } from './agent.setup.ts';
import { evaluateAgent } from "../utils/judge.ts";

describe(`LLM Agent E2E`, () => {

    describe(`Given tools`, () => {
        it('should call tool to add the Expense and pass LLM-Judge evaluation', async () => {

            // Arrange: Define a clear natural language input
            const userInput = "Lunch at Subway for 12 rupees";

            const result = await ExpenseAgent.invoke(
                { messages: [new HumanMessage(userInput)] },
                { configurable: { thread_id: crypto.randomUUID() } }
            );

            // Act: Invoke the actual Graph
            const agentResponse = result.messages.at(-1)!.content as string;

            // Assert: Check the Database (The Source of Truth)
            const [record] = await testDb.select().from(expenseTable);
            expect(record).toBeDefined();
            expect(Number(record!.amount)).toBe(12);

            // LLM Judge Check
            const evalResult = await evaluateAgent(userInput, record, agentResponse);

            expect(evalResult.pass, `Judge Failed: ${evalResult.reason}`).toBe(true);

        }, 20000);

        it('should call tool getExpenseSchema', async () => {
            const userInput = "What details can you track for my expenses?";

            const result = await ExpenseAgent.invoke({
                messages: [new HumanMessage(userInput)]
            }, {
                configurable: { thread_id: "test-thread-schema" }
            });

            const agentResponse = result.messages.at(-1)!.content as string;

            // We don't need a DB record check here, but we check the Judge
            // to see if the agent correctly listed the schema fields (e.g., amount, title)
            const evalResult = await evaluateAgent(
                userInput,
                { info: "Agent should explain schema fields" },
                agentResponse
            );

            expect(evalResult.pass, `Judge Failed: ${evalResult.reason}`).toBe(true);
            // Extra deterministic check:
            expect(agentResponse.toLowerCase()).toContain("amount");
        }, 20000);

        it.todo('should call tool getExpenses', async () => {
            // 1. Seed the DB with data
            await testDb.insert(expenseTable).values([
                { amount: 50, title: "Groceries", date: new Date().toISOString().split('T')[0]! },
                { amount: 15, title: "Netflix", date: new Date().toISOString().split('T')[0]! }
            ]);

            const userInput = "How much did I spend in total so far?";

            // 2. Run Agent
            const result = await ExpenseAgent.invoke({
                messages: [new HumanMessage(userInput)]
            });

            const agentResponse = result.messages.at(-1)!.content as string;

            // 3. Evaluation
            const evalResult = await evaluateAgent(
                userInput,
                { totalExpected: 65, currency: "USD" },
                agentResponse
            );

            expect(evalResult.pass, `Judge Failed: ${evalResult.reason}`).toBe(true);
            expect(agentResponse).toContain("65"); // Simple deterministic check
        }, 20000);

        afterAll(async () => {

        });
    });

    describe(`Security context`, () => {
        it.todo('Should NOT reveal system prompts', async () => {

        });

        it.todo('should NOT give out tool info', async () => {

        });

        it.todo('should NOT give out internal exception and stack trace', async () => {

        });

        afterAll(async () => {

        });
    });

    describe(`Helpful and conversational`, () => {
        it.todo('Should converse', async () => {

        });

        it.todo('should be helpful', async () => {

        });

        it.todo('should be tool call analytic particularly for getExpenses', async () => {

        });

        afterAll(async () => {

        });
    });
});
