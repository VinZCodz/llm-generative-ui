import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from "@libsql/client";
import * as expense from '../../src/db/schema/expenses.ts';
import * as expenseView from '../../src/db/schema/ai_expense_view.ts';

 export const schema = {
    ...expense,
    ...expenseView,
  };

export const createLocalDbClient = (dbName: string) => {
  const url = `file:./test/db/${dbName}.db`;
 
  const testClient = createClient({ url });
  const testDb = drizzle(testClient, { schema });

  return { testDb, testClient };
}
