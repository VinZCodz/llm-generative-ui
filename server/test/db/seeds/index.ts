import { seedExpense } from "./expense";

async function seedTables() {
    try {
        console.log("🌱 Seeding database...");

        await seedExpense();

        console.log("✅ Seeded database successfully!");
    } catch (e) {
        console.error("❌ Seed failed:", e);
    }
}

seedTables();