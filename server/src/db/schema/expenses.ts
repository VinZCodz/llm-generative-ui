import { sqliteTable, text, integer, real, sqliteView } from 'drizzle-orm/sqlite-core';

export const expenseTable = sqliteTable("expenses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  amount: real("amount").notNull(),
  date: text("date").notNull(),
});

export type InsertExpense = typeof expenseTable.$inferInsert;
