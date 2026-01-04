import { createLocalDbClient } from '../../db/testClient.ts';
import { expenseTable } from '../../../src/db/schema/expenses.ts';
import { ExpenseService } from '../../../src/services/ExpenseService.ts';
import { SelectQueryGuard } from '../../../src/utils/SelectQueryGuard.ts';
import { initTools } from '../../../src/tools.ts';
import { inject } from 'vitest';
import { createExpenseTracker } from '../../../src/expenseAgent.ts';
import { llm } from "../../../src/model.ts"
import { SYSTEM_PROMPT } from "../../../src/prompt.ts"
import { MemorySaver } from '@langchain/langgraph';

// Get the name provided by Global Setup
const { dbName } = inject('test_db_config');

// Initialize the "Unit of Work" for this test file
export const { testDb, testClient } = createLocalDbClient(dbName);
const expenseService = new ExpenseService(testDb, testDb, new SelectQueryGuard());

const tools = initTools(expenseService);
export const ExpenseAgent = createExpenseTracker({ llm, tools, systemPrompt: SYSTEM_PROMPT, checkpointer: new MemorySaver() });

// Lifecycle Management
beforeEach(async () => {
    await testDb.delete(expenseTable);
});

afterAll(async () => {
    await testClient.close();
});