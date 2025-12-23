import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from "@libsql/client";
import * as expense from '../../src/db/schema/expenses.ts';
import { migrate } from 'drizzle-orm/libsql/migrator';

export const createTestDb = async () => {
    const testClient = createClient({ url: "file:test.db" });
    const testDb = drizzle(testClient, { schema: expense });

    await migrate(testDb, { migrationsFolder: './drizzle' });

    return { testDb, testClient };
};