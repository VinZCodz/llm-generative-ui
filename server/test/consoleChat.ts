import * as readline from 'node:readline/promises';
import { ExpenseTrackerAgent } from "../src/graph.ts";

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