import { db } from "../../../src/db/client";
import { expenseTable } from "../../../src/db/schema/expenses";

/* 
Helper to get YYYY-MM-DD string with a day offset.
Used to seed fresh/latest expenses in last 30 days, offset by todays date.
*/
const getOffsetDate = (offset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().split('T')[0]?.toString()!;
};

const seedData = [
  { title: "Groceries", amount: 85.50, date: getOffsetDate(0) },
  { title: "Internet", amount: 60.00, date: getOffsetDate(1) },
  { title: "Coffee", amount: 4.75, date: getOffsetDate(2) },
  { title: "Gas", amount: 45.20, date: getOffsetDate(3) },
  { title: "Netflix", amount: 15.99, date: getOffsetDate(4) },
  { title: "Gym", amount: 50.00, date: getOffsetDate(5) },
  { title: "Dinner", amount: 112.30, date: getOffsetDate(6) },
  { title: "Electric", amount: 120.00, date: getOffsetDate(7) },
  { title: "Bus Pass", amount: 30.00, date: getOffsetDate(8) },
  { title: "Amazon", amount: 24.99, date: getOffsetDate(9) },
  { title: "Lunch", amount: 12.50, date: getOffsetDate(10) },
  { title: "Insurance", amount: 150.00, date: getOffsetDate(11) },
  { title: "Movies", amount: 28.00, date: getOffsetDate(12) },
  { title: "Pet Food", amount: 35.00, date: getOffsetDate(13) },
  { title: "Pharmacy", amount: 18.75, date: getOffsetDate(14) },
  { title: "Car Wash", amount: 25.00, date: getOffsetDate(15) },
  { title: "Spotify", amount: 10.99, date: getOffsetDate(16) },
  { title: "Water Bill", amount: 45.00, date: getOffsetDate(17) },
  { title: "New Shirt", amount: 35.50, date: getOffsetDate(18) },
  { title: "Parking Fee", amount: 12.00, date: getOffsetDate(19) },
  { title: "Donation", amount: 20.00, date: getOffsetDate(20) },
  { title: "Dry Cleaning", amount: 22.50, date: getOffsetDate(21) },
  { title: "Haircut", amount: 40.00, date: getOffsetDate(22) },
  { title: "Phone Bill", amount: 75.00, date: getOffsetDate(23) },
  { title: "Book Store", amount: 18.90, date: getOffsetDate(24) },
  { title: "Bakery", amount: 8.45, date: getOffsetDate(25) },
  { title: "Streaming Service", amount: 12.99, date: getOffsetDate(26) },
  { title: "Office Supplies", amount: 55.20, date: getOffsetDate(27) },
  { title: "Public Transport", amount: 5.50, date: getOffsetDate(28) },
  { title: "Snacks", amount: 6.75, date: getOffsetDate(29) },
];

export async function seedExpense() {
  console.log("🧹 Resetting Expense...");
  await db.delete(expenseTable);

  console.log("🌱 Seeding Expense...");
  await db.insert(expenseTable).values(seedData);

  console.log("✅ Freshly seeded expenses!");
}
