import { testDb, testClient } from '../../db/client';
import { ExpenseService } from '../../../src/services/ExpenseService';
import { SelectQueryGuard } from '../../../src/utils/SelectQueryGuard';
import * as llmTools from '../../../src/tools';
import * as expense from '../../../src/db/schema/expenses.ts';
import type { StructuredTool } from 'langchain';

export const setupToolIntegration = (toolName: string) => {
    const expenseService = new ExpenseService(testDb, testDb, new SelectQueryGuard());
    const tools = llmTools.initTools(expenseService);
    const tool = tools.find(t => t.name === toolName) as StructuredTool;

    if (!tool) throw new Error(`${toolName} tool not found!`);

    beforeEach(async () => {
        await testDb.delete(expense.expenseTable);
    });

    afterAll(async () => {
        await testClient.close();
    });

    return { tool, testDb };
}