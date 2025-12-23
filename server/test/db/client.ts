import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from "@libsql/client";
import * as expense from '../../src/db/schema/expenses.ts';

export const testClient = createClient({ url: "file:./test/db/test-integration.db" });
export const testDb = drizzle(testClient, { schema: expense });

export type TestDatabase = typeof testDb;