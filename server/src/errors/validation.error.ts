export class SQLValidationError extends Error {
    constructor(message: string) {
        super(`[SQL Select Query Validation Error] ${message}`);
        this.name = 'SQLValidationError';
        this.message = message;
    }
}
