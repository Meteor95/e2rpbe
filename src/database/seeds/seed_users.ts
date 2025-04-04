import { db } from "@database/connection";
import { eds_users } from "@database/schema/eds_users";
import { faker } from "@faker-js/faker";

async function seed() {
    console.log("Seeding database...");
    await db.delete(eds_users);
    const password = "password";
    const bcryptHash = await Bun.password.hash(password, {
        algorithm: "bcrypt",
        cost: 12
      });
    const hasher = new Bun.CryptoHasher("sha256");
    hasher.update(`${faker.string.uuid().replace(/-/g, '')}`);
    const users = Array.from({ length: 1 }).map(() => ({
        uuid: faker.string.uuid(),
        email: faker.internet.email(),
        phone: faker.phone.number({ style: 'international' }),
        username: faker.internet.displayName(),
        password: bcryptHash,
        role: faker.helpers.arrayElement([1, 2, 3]),
        registration_number: faker.string.alphanumeric(10),
        status: faker.datatype.boolean(),
        max_allowed_login: faker.number.int({ min: 1, max: 10 }),
        token: "eds_"+hasher.digest("hex"),
        created_at: new Date(),
        updated_at: new Date(),
    }));
    await db.insert(eds_users).values(users).execute();
    console.log("✅ Seeding user selesai!");
}
seed().catch((err) => {
    console.error("❌ Error saat seeding:", err);
    process.exit(1);
});
