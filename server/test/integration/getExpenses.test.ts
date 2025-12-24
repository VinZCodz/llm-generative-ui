import { setupToolIntegration } from './utils/helper.ts';

const toolName = 'getExpenses';

describe(`Integration Suite for tool: ${toolName} `, () => {
    const { tool, testDb } = setupToolIntegration(toolName);

    describe(`Given Read-Only Select Query on Whitelisted table`, () => {
        it.todo('should fetch records from db', async () => {
            // Arrange
            const mockInput = { title: 'Coffee', amount: 49.99 };

            // Act
            const result = await tool.invoke(mockInput);

            // Assert
            expect(result).toHaveProperty('status', 'success');

            // Verify in DB
            const data = await testDb.query.expenseTable.findMany();

            expect(data).toHaveLength(1);
            expect(data[0]!.title).toBe(mockInput.title);
            expect(data[0]!.amount).toBe(mockInput.amount);
        });

        it.todo('should fetch records of length equal to maxNumberOfRecords', async () => {
            // Arrange
            const mockInput = { title: 'Coffee', amount: 49.99 };

            // Act
            const result = await tool.invoke(mockInput);

            // Assert
            expect(result).toHaveProperty('status', 'success');

            // Verify in DB
            const data = await testDb.query.expenseTable.findMany();

            expect(data).toHaveLength(1);
            expect(data[0]!.title).toBe(mockInput.title);
            expect(data[0]!.amount).toBe(mockInput.amount);
        });

        it.todo('should fetch records not older than 2 months', async () => {
            // Arrange
            const mockInput = { title: 'Coffee', amount: 49.99 };

            // Act
            const result = await tool.invoke(mockInput);

            // Assert
            expect(result).toHaveProperty('status', 'success');

            // Verify in DB
            const data = await testDb.query.expenseTable.findMany();

            expect(data).toHaveLength(1);
            expect(data[0]!.title).toBe(mockInput.title);
            expect(data[0]!.amount).toBe(mockInput.amount);
        });

        it.todo('should NOT fetch columns that are marked PII(not in view)', async () => {
            // Arrange
            const mockInput = { title: 'Coffee', amount: 49.99 };

            // Act
            const result = await tool.invoke(mockInput);

            // Assert
            expect(result).toHaveProperty('status', 'success');

            // Verify in DB
            const data = await testDb.query.expenseTable.findMany();

            expect(data).toHaveLength(1);
            expect(data[0]!.title).toBe(mockInput.title);
            expect(data[0]!.amount).toBe(mockInput.amount);
        });
    })

    describe(`Given Read-Only Complex Select Query(Aggregation, CTEs, Self-Joins) on Whitelisted table`, () => {
        it.todo('should perform Aggregation', async () => {
            // Arrange
            const mockInput = { title: 'Coffee', amount: 49.99 };

            // Act
            const result = await tool.invoke(mockInput);

            // Assert
            expect(result).toHaveProperty('status', 'success');

            // Verify in DB
            const data = await testDb.query.expenseTable.findMany();

            expect(data).toHaveLength(1);
            expect(data[0]!.title).toBe(mockInput.title);
            expect(data[0]!.amount).toBe(mockInput.amount);
        });

        it.todo('should perform CTEs', async () => {
            // Arrange
            const mockInput = { title: 'Coffee', amount: 49.99 };

            // Act
            const result = await tool.invoke(mockInput);

            // Assert
            expect(result).toHaveProperty('status', 'success');

            // Verify in DB
            const data = await testDb.query.expenseTable.findMany();

            expect(data).toHaveLength(1);
            expect(data[0]!.title).toBe(mockInput.title);
            expect(data[0]!.amount).toBe(mockInput.amount);
        });

        it.todo('should perform self-joins', async () => {
            // Arrange
            const mockInput = { title: 'Coffee', amount: 49.99 };

            // Act
            const result = await tool.invoke(mockInput);

            // Assert
            expect(result).toHaveProperty('status', 'success');

            // Verify in DB
            const data = await testDb.query.expenseTable.findMany();

            expect(data).toHaveLength(1);
            expect(data[0]!.title).toBe(mockInput.title);
            expect(data[0]!.amount).toBe(mockInput.amount);
        });
    })

    describe(`Given Destructive Query having FORBIDDEN_KEYWORDS, DDoS or Mutation attempts`, () => {
        it.todo('should error and ask for retry!', async () => {
            // Arrange
            const mockInput = { title: 'Coffee', amount: 49.99 };

            // Act
            const result = await tool.invoke(mockInput);

            // Assert
            expect(result).toHaveProperty('status', 'success');

            // Assert to have the words Fix and Retry in the error

            // Cross-Check in DB for any Destructions
            const data = await testDb.query.expenseTable.findMany();

            expect(data).toHaveLength(1);
            expect(data[0]!.title).toBe(mockInput.title);
            expect(data[0]!.amount).toBe(mockInput.amount);
        });

        it.todo('One more strong test case on DDoS or Mutation attempts');
    })

    describe(`Given Multiple SQL statements, injections`, () => {
        it.todo('should error and ask for retry!', async () => {
            // Arrange
            const mockInput = { title: 'Coffee', amount: 49.99 };

            // Act
            const result = await tool.invoke(mockInput);

            // Assert
            expect(result).toHaveProperty('status', 'success');

            // Assert to have the words Fix and Retry in the error

            // Cross-Check in DB for any injections
            const data = await testDb.query.expenseTable.findMany();

            expect(data).toHaveLength(1);
            expect(data[0]!.title).toBe(mockInput.title);
            expect(data[0]!.amount).toBe(mockInput.amount);
        });
    })

    describe(`Given Read-Only Select Query on Blacklisted/Unauthorized table`, () => {
        it.todo('should error and ask for retry!', async () => {
            // Arrange
            const mockInput = { title: 'Coffee', amount: 49.99 };

            // Act
            const result = await tool.invoke(mockInput);

            // Assert
            expect(result).toHaveProperty('status', 'success');
        });
    })
});