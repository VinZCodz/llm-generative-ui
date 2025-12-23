import * as llmTools from '../../../src/tools.ts'
import { createTestDb } from '../../db/client.ts';
import { ExpenseService } from "../../../src/services/ExpenseService.ts";
import { SelectQueryGuard } from '../../../src/utils/SelectQueryGuard.ts';
import type { Client } from '@libsql/client';
import type { StructuredTool } from 'langchain';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as expense from '../../../src/db/schema/expenses.ts';

const toolName = 'addExpense';

describe(`Integration Suite for tool: ${toolName} `, () => {
    let addExpenseTool: StructuredTool
    let testClient: Client;
    let testDb: LibSQLDatabase<typeof expense>;

    beforeAll(async () => {
        ({ testDb, testClient } = await createTestDb());
        const expenseService = new ExpenseService(testDb, testDb, new SelectQueryGuard());
        const tools = llmTools.initTools(expenseService);

        addExpenseTool = tools.find(t => t.name === toolName) as StructuredTool;
        if (!addExpenseTool) {
            throw new Error(`${toolName} tool not found!`);
        }
    })

    beforeEach(async () => {
        // Delete all rows from tables involved in tests
        await testDb.delete(expense.expenseTable);
    });

    it('should save expense to db', async () => {
        // Arrange
        const mockInput = { title: 'Coffee', amount: 49.99 };

        // Act
        const result = await addExpenseTool.invoke(mockInput);

        // Assert
        expect(result).toHaveProperty('status', 'success');

        // Verify in DB
        const data = await testDb.query.expenseTable.findMany();

        expect(data).toHaveLength(1);
        expect(data[0]!.title).toBe(mockInput.title);
        expect(data[0]!.amount).toBe(mockInput.amount);
    });

    afterAll(async () => {
        await testClient.close();
    });
});