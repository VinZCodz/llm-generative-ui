import { createLocalDbClient } from '../../db/testClient';
import { migrate } from 'drizzle-orm/libsql/migrator';
import type { TestProject } from 'vitest/node'

export async function setup(project: TestProject) {
    const dbName = 'integration-llm';
    project.provide('test_db_config', { dbName });

    const { testDb, testClient, } = createLocalDbClient(dbName);

    console.log('⏳ Migrating Test Database...');

    await migrate(testDb, {
        migrationsFolder: './migrations'
    });

    console.log('✅ Migration Sync Complete.');

    // Important: close the persistent connection so tests can open their own
    await testClient.close();
}

//only simple primitives can be provide/inject are allowed
//the worker thread need to "re-hydrate" the actual DB connection using factory
declare module 'vitest' {
    export interface ProvidedContext {
        test_db_config: {
            dbName: string
        }
    }
}