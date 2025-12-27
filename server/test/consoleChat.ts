import * as readline from 'node:readline/promises';
import { MemorySaver } from '@langchain/langgraph';
import { createExpenseTracker } from "../src/expenseAgent.ts";
import { ExpenseService } from "../src/services/ExpenseService.ts";
import * as client from "../src/db/client.ts";
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as expense from '../src/db/schema/expenses.ts';
import { SelectQueryGuard } from "../src/utils/SelectQueryGuard.ts";
import { initTools } from "../src/tools.ts";
import { llm } from "../src/model.ts"
import { SYSTEM_PROMPT } from "../src/prompt.ts"

const expenseService = new ExpenseService(
    client.db as unknown as LibSQLDatabase<typeof expense>,
    client.roDB as unknown as LibSQLDatabase<typeof expense>,
    new SelectQueryGuard()
);
const tools = initTools(expenseService)

const ExpenseTrackerAgent = createExpenseTracker({ llm, tools, systemPrompt: SYSTEM_PROMPT, checkpointer: new MemorySaver() });
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const main = async () => {
    while (true) {
        const userPrompt = await rl.question('You:\n');
        if (userPrompt === '/bye') {
            break;
        }
        const config = { configurable: { thread_id: "1" } };

        const response = await ExpenseTrackerAgent.invoke({ messages: [{ role: "user", content: userPrompt }] }, config);
        console.log(`Expense Tracker:\n${response.messages.at(-1)?.content}`);
    }
}

await main()
    .finally(() => {
        console.warn(`\nBye!\n`);
        rl.close()
    });