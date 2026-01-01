import { getTool } from '../utils/helper.ts';
import { testDb } from './tools.setup.ts';

const toolName = 'addExpense';

describe(`Integration Suite for tool: ${toolName} `, () => {
    const tool = getTool(toolName);

    it('should save expense to db', async () => {
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
});