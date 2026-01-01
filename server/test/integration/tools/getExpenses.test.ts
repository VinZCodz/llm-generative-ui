import { expenseTable } from '../../../src/db/schema/expenses.ts';
import { getTool } from '../utils/helper.ts';
import { testDb } from './tools.setup.ts';

const toolName = 'getExpenses';

/**
 * @CRITICAL
 * Integration suite that ensures:
 * Capability: LLMs can do math, use CTEs, and perform self-joins.
 * Safety: LLMs cannot delete data, run multiple commands, or access private tables.
 * Efficiency: LLMs are restricted by date windows and result limits.
 */
describe(`Integration Suite for tool: ${toolName} `, () => {
    const tool = getTool(toolName);

    describe(`Given Read-Only Select Query on Whitelisted View`, () => {
        it('should fetch records from db', async () => {
            // 1. Arrange: Seed the base table
            const seedData = {
                title: 'Coffee',
                amount: 49.99,
                date: new Date().toISOString().split('T')[0]!
            };

            await testDb.insert(expenseTable).values(seedData);

            // 2. Act: LLM provides a query targeting the VIEW, not the table
            const toolInput = {
                query: "SELECT * FROM ai_expense_view WHERE title = 'Coffee'",
                maxNumberOfRecords: 10
            };

            const result = await tool.invoke(toolInput);
            console.log(result);

            // 3. Assert:
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
            expect(result[0]).toMatchObject(seedData);
        });

        /**
         * @CRITICAL
         * Why: LLMs are prone to "Data Dumping." Without strict limit enforcement, 
         * a broad query could hallucinate or fetch thousands of rows, crashing 
         * the context window or incurring massive token costs.
         */
        it('should fetch records of length equal to maxNumberOfRecords', async () => {
            const today = new Date().toISOString().split('T')[0]!;
            const seedData = [
                { title: 'Coffee', amount: 5.00, date: today },
                { title: 'Lunch', amount: 15.00, date: today },
                { title: 'Train', amount: 10.00, date: today },
                { title: 'Dinner', amount: 25.00, date: today },
            ];
            await testDb.insert(expenseTable).values(seedData);

            const limit = 2;
            const toolInput = {
                query: "SELECT * FROM ai_expense_view",
                maxNumberOfRecords: limit
            };
            const result = await tool.invoke(toolInput);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(limit);
        });

        it('should fetch records not older than 2 months', async () => {
            // 1. Arrange: One record inside the window, one outside
            const dateInside = new Date();
            dateInside.setMonth(dateInside.getMonth() - 1);

            const dateOutside = new Date();
            dateOutside.setMonth(dateOutside.getMonth() - 3);

            await testDb.insert(expenseTable).values([
                { title: 'Valid Entry', amount: 10, date: dateInside.toISOString().split('T')[0]! },
                { title: 'Expired Entry', amount: 50, date: dateOutside.toISOString().split('T')[0]! }
            ]);

            // 2. Act
            const result = await tool.invoke({
                query: "SELECT * FROM ai_expense_view"
            });

            // 3. Assert: The view itself must have filtered the "Expired Entry"
            expect(result).toHaveLength(1);
            expect(result[0].title).toBe('Valid Entry');
        });

        it.todo('should NOT fetch columns that are marked PII(not in view)', async () => {

        });
    })

    describe(`Given Read-Only Complex Select Query(Aggregation, CTEs, Self-Joins) on Whitelisted table`, () => {
        it('should perform Aggregation (SUM and COUNT)', async () => {
            // Arrange
            const today = new Date().toISOString().split('T')[0]!;
            const seeds = [
                { title: 'Lunch', amount: 22.50, date: today },
                { title: 'Dinner', amount: 45.00, date: today }
            ];

            await testDb.insert(expenseTable).values(seeds);

            // Act
            const result = await tool.invoke({
                query: "SELECT COUNT(*) as total_count, SUM(amount) as total_sum FROM ai_expense_view"
            });

            // Assert
            const expectedSum = seeds.reduce((acc, curr) => acc + curr.amount, 0);

            expect(result).toHaveLength(1);
            expect(Number(result[0].total_sum)).toBe(expectedSum);
            expect(Number(result[0].total_count)).toBe(seeds.length);
        });

        it('should perform CTEs', async () => {
            // Arrange
            const today = new Date().toISOString().split('T')[0]!;
            const seeds = [
                { title: 'Rent', amount: 1000, date: today },
                { title: 'Gas', amount: 50, date: today }
            ];
            await testDb.insert(expenseTable).values(seeds);

            // Act: A CTE that calculates total then filters
            const toolInput = {
                query: `
                        WITH Summary AS (
                            SELECT SUM(amount) as total FROM ai_expense_view
                        )
                        SELECT total FROM Summary WHERE total > 500
                    `
            };

            const result = await tool.invoke(toolInput);

            // Assert
            expect(result).toHaveLength(1);
            expect(Number(result[0].total)).toBe(1050);
        });

        it('should perform self-joins (e.g., finding transactions with identical amounts)', async () => {
            // 1. Arrange: Seed data with two items having the same amount
            const date = new Date().toISOString().split('T')[0]!;
            await testDb.insert(expenseTable).values([
                { title: 'Lunch A', amount: 15.50, date },
                { title: 'Lunch B', amount: 15.50, date },
                { title: 'Dinner', amount: 40.00, date },
            ]);

            // 2. Act: A self-join to find entries with matching amounts but different titles
            const toolInput = {
                query: `
            SELECT t1.title as item1, t2.title as item2, t1.amount
            FROM ai_expense_view t1
            JOIN ai_expense_view t2 ON t1.amount = t2.amount AND t1.title != t2.title
        `
            };

            const result = await tool.invoke(toolInput);

            // 3. Assert
            expect(result).toHaveLength(2); // (A, B) and (B, A)
            expect(result[0].amount).toBe(15.50);

            const titles = [result[0].item1, result[0].item2];
            expect(titles).toContain('Lunch A');
            expect(titles).toContain('Lunch B');
        });
    })

    describe(`Given Destructive Query having FORBIDDEN_KEYWORDS, DDoS or Mutation attempts`, () => {
        it('should error and ask for retry!', async () => {
            // 1. Arrange: Seed a record to ensure it SURVIVES the attempt
            const mockRecord = { title: 'Safe Record', amount: 10.00, date: '2024-01-01' };
            await testDb.insert(expenseTable).values(mockRecord);

            const maliciousInput = {
                query: "DELETE FROM ai_expense_view; DROP TABLE expenseTable;",
                maxNumberOfRecords: 1
            };

            // 2. Act
            const result = await tool.invoke(maliciousInput);

            console.log(result.message);

            // 3. Assert: Verify the tool returns the constructive error string
            expect(result.status).toBe('error');
            expect(result.message).toContain('Failed');
            expect(result.suggestion).toContain('Retry');

            // 4. Cross-Check in DB: Verification of NO destruction
            const data = await testDb.select().from(expenseTable);
            expect(data).toHaveLength(1);
            expect(data[0]!.title).toBe('Safe Record');
        });

        it('should block query stacking and comment-masked mutations', async () => {
            // 1. Arrange: Seed a record to ensure it survives the bypass attempt
            const seed = { title: 'Safe Asset', amount: 100, date: '2024-01-01' };
            await testDb.insert(expenseTable).values(seed);

            // 2. Act: Attempt a "Shadow Mutation"
            // Using a comment to try and confuse simple regex guards 
            // and a semicolon to stack a destructive command.
            const maliciousInput = {
                query: `
                        SELECT * FROM ai_expense_view; -- legitimate query ends
                        DELETE FROM expenseTable;      /* malicious shadow query */
                    `
            };

            const result = await tool.invoke(maliciousInput);

            // 3. Assert: Verify the tool returns the constructive error string
            expect(result.status).toBe('error');
            expect(result.message).toContain('Failed');
            expect(result.suggestion).toContain('Retry');

            // 4. Cross-Check in DB: Verification of NO destruction
            const data = await testDb.select().from(expenseTable);
            expect(data).toHaveLength(1);
            expect(data[0]!.title).toBe('Safe Asset');
        });
    })

    describe(`Given Multiple SQL statements, injections: "Polyglot Persistence", "Statement Stacking", "piggyback"`, () => {
        it('should error and ask for retry', async () => {
            // 1. Arrange: Seed data to ensure safety
            const seed = { title: 'Untouchable', amount: 99, date: '2024-01-01' };
            await testDb.insert(expenseTable).values(seed);

            // 2. Act: Attempt to stack a valid SELECT with an unauthorized one
            const maliciousInput = {
                query: "SELECT * FROM ai_expense_view; SELECT * FROM expenseTable;"
            };

            const result = await tool.invoke(maliciousInput);

            // 3. Assert: Verify the tool returns the constructive error string
            expect(result.status).toBe('error');
            expect(result.message).toContain('Failed');
            expect(result.suggestion).toContain('Retry');
        });
    })

    /**
     * @CRITICAL
     * Why: Isolation Test. 
     * This prevents "Prompt Injection" where an LLM is tricked into snooping through the underlying DB schema
     */
    describe(`Given Read-Only Select Query on Blacklisted/Unauthorized table`, () => {
        it('should error and ask for retry!', async () => {
            // 1. Arrange: Seed data into the raw table
            const seed = { title: 'Secret Transaction', amount: 5000, date: '2024-01-01' };
            await testDb.insert(expenseTable).values(seed);

            // 2. Act: Query the raw table directly instead of the whitelisted view
            const maliciousInput = {
                query: "SELECT * FROM expenseTable" // expenseTable is NOT in allowedTables
            };

            const result = await tool.invoke(maliciousInput);

            // 3. Assert: Verify the tool returns the constructive error string
            expect(result.status).toBe('error');
            expect(result.message).toContain('Failed');
            expect(result.suggestion).toContain('Retry');

            expect(result).not.toContain('Secret Transaction');
        });
    })
});