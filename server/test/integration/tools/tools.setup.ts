import { createLocalDbClient } from '../../db/testClient';
import { expenseTable } from '../../../src/db/schema/expenses';
import { ExpenseService } from '../../../src/services/ExpenseService';
import { SelectQueryGuard } from '../../../src/utils/SelectQueryGuard';
import { initTools } from '../../../src/tools';
import { inject } from 'vitest';

// Get the name provided by Global Setup
const { dbName } = inject('test_db_config');

// Initialize the "Unit of Work" for this test file
export const { testDb, testClient } = createLocalDbClient(dbName);
export const expenseService = new ExpenseService(testDb, testDb, new SelectQueryGuard());

export const tools = initTools(expenseService);

// Lifecycle Management
beforeEach(async () => {
    await testDb.delete(expenseTable);
});

afterAll(async () => {
    await testClient.close();
});