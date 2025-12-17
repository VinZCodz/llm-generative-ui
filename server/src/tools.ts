import { tool } from "langchain";
import z from "zod";

export const addExpense = tool(
    ({ title, amount}) => {
        console.log({ title, amount});

        return JSON.stringify({status: 'success!'});
    },
    {
        name: "add_expense",
        description: "Add the given expense to database",
        schema: z.object({
            title: z.number().describe("Expense title"),
            amount: z.number().describe("Amount spent"),
        }),
    });