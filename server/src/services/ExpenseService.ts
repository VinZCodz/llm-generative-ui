import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as expense from '../db/schema/expenses.ts';
import * as expenseView from '../db/schema/ai_expense_view.ts';
import { sql } from 'drizzle-orm';
import type { SelectQueryGuard } from '../utils/SelectQueryGuard.ts';
import { SQLValidationError } from '../errors/validation.error.ts';
import { getViewConfig } from 'drizzle-orm/sqlite-core';

export class ExpenseService {
    private readonly viewConfig;
    constructor(
        private readonly db: LibSQLDatabase<typeof expense>,
        private readonly roDB: LibSQLDatabase<typeof expense>,
        private readonly validator: SelectQueryGuard
    ) {
        this.viewConfig = getViewConfig(expenseView.aiExpenseView);
    }

    public async add(data: expense.InsertExpense) {
        await this.db.insert(expense.expenseTable).values(data);
    }

    public getSchema() {
        const name = this.viewConfig.name;
        const columns = Object.entries(this.viewConfig.selectedFields).map(([tsKey, col]: [string, any]) =>
            `${col.name || tsKey} ${col.getSQLType() || col.dataType}`
        );

        return { name, columns }
    }

    public async executeSelectQuery(rawQuery: string, maxNumberOfRecords = 100) {
        const validation = this.validator.validate(rawQuery, [this.viewConfig.name]);

        console.log({ validation });

        if (!validation.isValid) {
            throw new SQLValidationError(validation.error!);
        }

        //Sandbox query with LIMIT: Safeguards agent from processing million of rows at once.
        return await this.roDB.all(sql.raw(`SELECT * FROM (${rawQuery}) AS sandbox_query LIMIT ${maxNumberOfRecords}`));
    }
}
