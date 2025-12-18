import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as expense from '../db/schema/expenses.ts';

export class ExpenseService {
    constructor(private readonly db: LibSQLDatabase<typeof expense>) { }

    public async addExpense(data: expense.InsertExpense) {
        await this.db.insert(expense.expenseTable).values(data);
    }
}
