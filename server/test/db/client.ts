import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from "@libsql/client";
import * as expense from '../../src/db/schema/expenses.ts';
import * as expenseView from '../../src/db/schema/ai_expense_view.ts';

export const schema = {
  ...expense,
  ...expenseView,
};

export const testClient = createClient({ url: "file:./test/db/test-integration.db" });
export const testDb = drizzle(testClient, { schema });

export type TestDatabase = typeof testDb;