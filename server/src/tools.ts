import { tool } from "langchain";
import { ExpenseService } from "./services/ExpenseService";
import z from "zod";
import { SQLValidationError } from "./errors/validation.error";

export const initTools = (expenseService: ExpenseService) => {

    const addExpense = tool(
        async ({ title, amount }) => {
            const date = new Date().toISOString().split('T')[0]!;

            console.log("Adding Expense: ", { title, amount, date });//TODO: Use winston

            await expenseService.add({ title, amount, date });

            return { status: 'success' };
        },
        {
            name: "addExpense",
            description: "To add the given expense to database",
            schema: z.object({
                title: z.string().nonempty().describe("Expense title"),
                amount: z.number().positive().describe("Amount spent"),
            }),
        });

    const getExpenseSchema = tool(
        () => expenseService.getSchema(),
        {
            name: 'getExpenseSchema',
            description: 'Provides the schema metadata for expense table. Call before get operations on expense'
        });

    const getExpenses = tool(
        async ({ query, maxNumberOfRecords }) => {
            console.log("Select Query: ", { query, maxNumberOfRecords });//TODO: Use winston

            try {
                return await expenseService.executeSelectQuery(query, maxNumberOfRecords);
            } catch (error) {
                //Important! catch only validation errors so llm can regenerate the query.
                if (error instanceof SQLValidationError) {
                    console.error("Query Validation Failed:", error.message);//TODO: Use winston
                    return {
                        status: 'error',
                        message: `Query Validation Failed: ${error.message}`,
                        suggestion: "Fix the error accordingly and Retry"
                    };
                }
                else {
                    throw error;//Important! all the other errors are handled at global level.
                }
            }
        },
        {
            name: "getExpenses",
            description: 'Queries a single/multiple Expense from view. Supports complex SQL (Aggregation, CTEs, Self-Joins). Needs database schema first to form the query',
            schema: z.object({
                query: z.string().describe('Strictly SQL SELECT query. Optimize query for effective data retrieval'),
                maxNumberOfRecords: z.number().optional().default(20).describe('Number of rows to return for analysis. Be mindful of user tokens')
            }),
        });

    return [
        addExpense,

        getExpenseSchema,
        getExpenses,
    ]
}
