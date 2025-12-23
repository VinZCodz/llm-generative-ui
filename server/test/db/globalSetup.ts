import { testDb, testClient } from './client';
import { migrate } from 'drizzle-orm/libsql/migrator';
import path from 'path';

export async function setup() {
    console.log('⏳ Migrating Test Database...');

    await migrate(testDb, {
        migrationsFolder: './migrations'
    });

    console.log('✅ Migration Sync Complete.');

    // Important: close the persistent connection so tests can open their own
    await testClient.close();
}