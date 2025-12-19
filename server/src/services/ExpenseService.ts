import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as expense from '../db/schema/expenses.ts';
import { sql } from 'drizzle-orm';

export class ExpenseService {
    constructor(private readonly db: LibSQLDatabase<typeof expense>) { }

    public async addExpense(data: expense.InsertExpense) {
        await this.db.insert(expense.expenseTable).values(data);
    }

    public async getSchema() {
        expense.expenseTable.getSQL();
    }

    public async executeReadOnlyQuery(rawQuery: string) {
        const normalizedQuery = rawQuery.trim().replace(/\s+/g, ' ');

        if (!READ_ONLY_REGEX.test(normalizedQuery)) {
            console.error(`Blocked dangerous query attempt: ${normalizedQuery}`); //TODO: Use winston
            throw new SecurityError(
                'Only SELECT statements are permitted, and the query contains forbidden keywords.',
                'Query failed security validation.'
            );
        }

        console.log("Query:", normalizedQuery); //TODO: Use winston
        return await this.db.all(sql.raw(normalizedQuery));
    }
}

// A strict list of DML/DDL keywords that are forbidden.
const FORBIDDEN_KEYWORDS = [
    'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'DROP', 'ALTER', 'CREATE',
    'ATTACH', 'DETACH', 'PRAGMA', 'REINDEX', 'VACUUM', 'REPLACE', 'GRANT',
    'REVOKE', 'BEGIN', 'COMMIT', 'ROLLBACK', 'SAVEPOINT',
    'sqlite_schema', 'sqlite_master', 'ai_permitted_tables_view'
].join('|');

const READ_ONLY_REGEX = new RegExp(
    `^\\s*SELECT(?:(?!\\b(?:${FORBIDDEN_KEYWORDS})\\b)[\\s\\S]*?)$`,
    'i' // Case-insensitive matching
);

export class SecurityError extends Error {
    constructor(cause: string, message: string) {
        super(`[SQL Security Violation] ${message}`);
        this.name = 'SecurityError';
        this.cause = cause;
        this.message = message;
    }
}
