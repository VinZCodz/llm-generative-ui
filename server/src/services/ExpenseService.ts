import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as expense from '../db/schema/expenses.ts';
import * as expenseView from '../db/schema/ai_expense_view.ts';
import { sql } from 'drizzle-orm';
import type { SelectQueryGuard } from '../utils/SelectQueryGuard.ts';

export class ExpenseService {
    constructor(
        private readonly db: LibSQLDatabase<typeof expense>,
        private readonly roDB: LibSQLDatabase<typeof expense>,
        private readonly validator: SelectQueryGuard
    ) { }

    public async add(data: expense.InsertExpense) {
        await this.db.insert(expense.expenseTable).values(data);
    }

    public async getSchema() {
        expenseView.aiExpenseView.getSQL();
    }

    public async executeSelectQuery(rawQuery: string, maxNumberOfRecords = 100) {
        const validation = this.validator.validate(rawQuery, [expenseView.aiExpenseView._.name]);

        if (!validation.isValid) {
            throw new Error(validation.error);
        }

        //Sandbox query with LIMIT: Safeguards agent from processing million of rows at once.
        return await this.roDB.all(sql.raw(`SELECT * FROM (${rawQuery}) LIMIT ${maxNumberOfRecords}`));
    }
}
