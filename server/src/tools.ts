import { tool } from "langchain";
import { ExpenseService } from "./services/ExpenseService";
import z from "zod";

export const initTools = (expenseService: ExpenseService) => {

    const addExpense = tool(
        async ({ title, amount }) => {
            const date = new Date().toISOString().split('T')[0]!;

            console.log("Adding Expense: ", { title, amount, date });//TODO: Use winston

            await expenseService.add({ title, amount, date });

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
            description: 'To get the schema structure of Expense view',
        });

    const getExpenses = tool(
        async ({ query, maxNumberOfRecords }) => {
            console.log("Select Query: ", { query, maxNumberOfRecords });//TODO: Use winston

            return await expenseService.executeSelectQuery(query, maxNumberOfRecords);
        },
        {
            name: "getExpenses",
            description: 'To get a single or multiple Expense, upto 2 months old only',
            schema: z.object({
                query: z.string().describe('Strictly Read-only SQL SELECT query. You may use joins, subqueries, and CTEs, but only referencing Expense view. Optimize query for effective data retrieval'),
                maxNumberOfRecords: z.number().describe('Max number of rows needed to answer/estimate. Be mindful of user tokens')
            }),
        });

    return [
        addExpense,

        getExpenseSchema,
        getExpenses,


    ]
}
