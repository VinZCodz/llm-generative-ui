import { setupToolIntegration } from './utils/helper.ts';
import * as expenseView from '../../src/db/schema/ai_expense_view.ts';
import { getViewConfig } from 'drizzle-orm/sqlite-core';

const toolName = 'getExpenseSchema';

describe(`Integration Suite for tool: ${toolName} `, () => {
    const { tool } = setupToolIntegration(toolName);

    it('should get the expense schema', async () => {
        // Arrange
        const viewConfig = getViewConfig(expenseView.aiExpenseView);
        const name = viewConfig.name;

        // Act
        const result = await tool.invoke({});

        // Assert
        expect(result).toHaveProperty('name', name);
        expect(result).toHaveProperty('columns');
        expect(result.columns).toHaveLength(Object.entries(viewConfig.selectedFields).length);
    });
});
