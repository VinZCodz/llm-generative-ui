import { sql } from "drizzle-orm";
import { db, roDB } from '../../src/db/client';

describe(`Infrastructure Integration Tests for Turso DB client: Connection & Permission Verification Tests`, () => {

    const testTableName = `_test_temp_table_${Date.now()}`;    // A unique table name for testing to avoid collisions

    describe(`Permission Boundary Validation: Given READ-ONLY client (roDB)`, () => {

        it('should fetch records from db (DQL allowed)', async () => {
            const result = await roDB.run(sql`SELECT 1`);
            expect(result).toBeDefined();
        });

        // Attempting to insert into a table (even if it doesn't exist, the RO token should trigger a permission error)
        it('should NOT be able to manipulate data (DML NOT allowed)', async () => {
            await expect(
                roDB.run(sql`INSERT INTO non_existent_table (id) VALUES (1)`)
            ).rejects.toThrow(/(read-only|authorized)/i);
        });

        it('should NOT be able to create db objects (DDL NOT allowed)', async () => {
            await expect(
                roDB.run(sql`CREATE TABLE ${sql.raw(testTableName)} (id INTEGER)`)
            ).rejects.toThrow(/read-only/i);
        });
    });

    describe(`Given FULL client (db)`, () => {
        
        it('should create db objects (DDL allowed)', async () => {
            const result = await db.run(sql`CREATE TABLE ${sql.raw(testTableName)} (id INTEGER PRIMARY KEY, val TEXT)`);
            expect(result).toBeDefined();
        });

        it('should manipulate data (DML allowed)', async () => {
            await db.run(sql`INSERT INTO ${sql.raw(testTableName)} (val) VALUES ('test-data')`);
            const select = await db.run(sql`SELECT * FROM ${sql.raw(testTableName)}`);
            expect(select.rows.length).toBe(1);
        });

        it('should fetch records from db (DQL allowed)', async () => {
            const result = await db.run(sql`SELECT * FROM ${sql.raw(testTableName)} LIMIT 1`);
            expect(result.rows).toBeDefined();
        });
    });

    describe("Transaction Integrity & Rollback (Atomic Operations)", () => {
        it("should completely rollback changes when a transaction fails", async () => {
            // 1. Create a table
            await db.run(sql.raw(`CREATE TABLE ${testTableName} (id INTEGER PRIMARY KEY, msg TEXT)`));

            // 2. Attempt a failing transaction
            try {
                await db.transaction(async (tx) => {
                    await tx.run(sql.raw(`INSERT INTO ${testTableName} (msg) VALUES ('This should not exist')`));
                    throw new Error("FORCED_FAILURE");
                });
            } catch (e) {
                // Expected failure
            }

            // 3. Assert: The table should be empty
            const result = await db.run(sql.raw(`SELECT count(*) as count FROM ${testTableName}`));
            expect(result.rows[0]!.count).toBe(0);
        });
    });

    describe("Connection & Timeout Performance", () => {
        it("should handle a burst of parallel queries", async () => {
            const queries = Array.from({ length: 10 }, () => db.run(sql`SELECT 1`));
            const results = await Promise.all(queries);
            expect(results.length).toBe(10);
        });
    });

    afterAll(async () => {
        try {
            await db.run(sql.raw(`DROP TABLE IF EXISTS ${testTableName}`));
        } catch (e) {
            console.error("Cleanup failed, manual intervention might be needed:", e);
        }
    });
});