import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as expense from '../db/schema/expenses.ts';
import * as expenseView from '../db/schema/ai_expense_view.ts';
import { asc, between, sql } from 'drizzle-orm';
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

    public async getExpensesByTimeInterval(fromDate: string, toDate: string, interval: GroupByInterval = 'month') {
        const config = intervalMap[interval];
        const period = sql<string>`strftime(${config}, ${expenseView.aiExpenseView.date})`;

        return await this.roDB
            .select({
                period: period,
                totalAmount: sql<number>`sum(${expenseView.aiExpenseView.amount})`.mapWith(Number),
            })
            .from(expenseView.aiExpenseView)
            .where(between(expenseView.aiExpenseView.date, fromDate, toDate))
            .groupBy(period)
            .orderBy(asc(period))
    }
}

type GroupByInterval = 'day' | 'month' | 'year';
const intervalMap: Record<GroupByInterval, string> = {
    day: '%Y-%m-%d',
    month: '%Y-%m',
    year: '%Y',
};
