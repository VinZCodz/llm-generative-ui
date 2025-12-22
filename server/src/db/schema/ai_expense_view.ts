import { sqliteView } from "drizzle-orm/sqlite-core";
import { expenseTable } from './expenses.ts';
import { sql } from "drizzle-orm/sql";

/**
 * View to avoid exposing PII columns done via wildcard specifier 'SELECT * ..' 
 * View to avoid complete table scan, restricting data upto n months. Agent saves token. 
 */

export const aiExpenseView = sqliteView("ai_expense_view").as((db) => {
    return db
        .select({
            id: expenseTable.id,
            title: expenseTable.title,
            amount: expenseTable.amount,
            date: expenseTable.date,
        })
        .from(expenseTable)
        .where(sql`${expenseTable.date} >= date('now', '-2 months')`);
});
