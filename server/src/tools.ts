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
            description: "To add the given expense to database",
            schema: z.object({
                title: z.string().nonempty().describe("Expense title"),
                amount: z.number().positive().describe("Amount spent"),
            }),
        });

    const getExpenseSchema = tool(
        () => {
            return expenseService.getSchema();
        },
        {
            name: 'getExpenseSchema',
            description: 'To get the schema structure of Expense table',
        });

    const getExpenses = tool(
        async ({ query }) => {
            return await expenseService.executeReadOnlyQuery(query);
        },
        {
            name: "getExpenses",
            description: 'To get a single or multiple Expense. Strictly read-only SQL SELECT statements allowed',
            schema: z.object({
                query: z.string().describe('Read-only SQL SELECT query. Optimized for data retrieval'),
            }),
        });

    return [
        getExpenseSchema,
        getExpenses,

        addExpense,
    ]
}
