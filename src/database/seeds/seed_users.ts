import { db } from "@utils/db";
import { eds_users } from "@models/auth/auth-model";
import { faker } from "@faker-js/faker";

async function seed() {
    console.log("Seeding database...");
    await db.delete(eds_users);
    const users = Array.from({ length: 10 }).map(() => ({
        id: faker.string.uuid(),
        uuid: faker.string.uuid(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
        role: faker.helpers.arrayElement([1, 2, 3]),
        registration_number: faker.string.alphanumeric(10),
        status: faker.datatype.boolean(),
        created_at: new Date(),
        updated_at: new Date(),
    }));
    await db.insert(eds_users).values(users);
    console.log("✅ Seeding user selesai!");
}
seed().catch((err) => {
    console.error("❌ Error saat seeding:", err);
    process.exit(1);
});
