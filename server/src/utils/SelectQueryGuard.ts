import { Parser } from 'node-sql-parser';

export class SelectQueryGuard {
    private parser;
    
    constructor() {
        this.parser = new Parser();
    }

    public validate(sql: string, allowedTables: string[]): ValidationResult {
        // Destructive KW, DDoS or mutation attempts
        if (FORBIDDEN_KEYWORDS.some(cmd => sql.toUpperCase().includes(cmd))) {
            return { isValid: false, error: "Destructive Keywords found! Only SELECT operations are allowed." };
        }

        const ast = this.parser.astify(sql, { database: 'sqlite' });

        // Prevent injection like "SELECT...; DROP TABLE..."
        if (Array.isArray(ast) && ast.length > 1) {
            return { isValid: false, error: "Multiple SQL statements are not allowed." };
        }

        const singleAst = Array.isArray(ast) ? ast[0]! : (ast as any);

        // Enforce Read-Only
        if (singleAst.type !== 'select') {
            return { isValid: false, error: "Operation must be a SELECT statement." };
        }
        
        // Allow CTEs
        const cteAliases: string[] = [];
        const withClause = singleAst.with;

        if (Array.isArray(withClause)) {
            for (const cte of withClause) {
                const aliasName = cte.alias?.value || cte.name?.value || cte.name;
                if (aliasName) cteAliases.push(aliasName);
            }
        }

        const effectivelyAllowed = [...allowedTables, ...cteAliases];

        // Table Whitelisting
        const usedTables = this.parser.tableList(sql, { database: 'sqlite' });

        for (const table of usedTables) {
            const tableName = table.split('::').pop(); // table obj format 'type::db::tableName'
            if (!tableName || !effectivelyAllowed.includes(tableName)) {
                return { isValid: false, error: `Access to table '${tableName}' is unauthorized.` };
            }
        }

        return { isValid: true };
    }
}

export type ValidationResult = {
    isValid: boolean;
    error?: string
}

//Destructive keywords
const FORBIDDEN_KEYWORDS = [
    'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'DROP', 'ALTER', 'CREATE',
    'ATTACH', 'DETACH', 'PRAGMA', 'REINDEX', 'VACUUM', 'REPLACE', 'GRANT',
    'REVOKE', 'BEGIN', 'COMMIT', 'ROLLBACK', 'SAVEPOINT',
    'sqlite_schema', 'sqlite_master'
]