import { tool } from "langchain";
import { ExpenseService } from "./services/ExpenseService";
import z from "zod";

export const initTools = (expenseService: ExpenseService) => {

    const addExpense = tool(
        async ({ title, amount }) => {
            const date = new Date().toISOString().split('T')[0]!;

            console.log("Adding Expense: ", { title, amount, date });//TODO: Use winston

            await expenseService.addExpense({ title, amount, date });

            return JSON.stringify({ status: 'success!' });
        },
        {
            name: "add_expense",
            description: "Add the given expense to database",
            schema: z.object({
                title: z.string().nonempty().describe("Expense title"),
                amount: z.number().positive().describe("Amount spent"),
            }),
        });

    const getExpense = tool(
        async ({ title, amount }) => {
            const date = new Date().toISOString().split('T')[0]!;

            console.log("Adding Expense: ", { title, amount, date });//TODO: Use winston

            await expenseService.addExpense({ title, amount, date });

            return JSON.stringify({ status: 'success!' });
        },
        {
            name: "get_expense",
            description: "Add the given expense to database",
            schema: z.object({
                title: z.string().nonempty().describe("Expense title"),
                amount: z.number().positive().describe("Amount spent"),
            }),
        });

    return [
        addExpense,
    ]
}
