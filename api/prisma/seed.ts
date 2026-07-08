import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DIRECT_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@grocery.com" },
    update: {},
    create: {
      email: "superadmin@grocery.com",
      password: hashedPassword,
      name: "Super Admin", // ← pakai name
      role: "SUPER_ADMIN",
      isVerified: true,
    },
  });
  console.log("✅ Super Admin created:", superAdmin.email);

  const storeAdmin = await prisma.user.upsert({
    where: { email: "storeadmin@grocery.com" },
    update: {},
    create: {
      email: "storeadmin@grocery.com",
      password: hashedPassword,
      name: "Store Admin", // ← pakai name
      role: "STORE_ADMIN",
      isVerified: true,
    },
  });
  console.log("✅ Store Admin created:", storeAdmin.email);

  const user = await prisma.user.upsert({
    where: { email: "user@grocery.com" },
    update: {},
    create: {
      email: "user@grocery.com",
      password: hashedPassword,
      name: "Regular User", // ← pakai name
      role: "CUSTOMER",
      isVerified: true,
    },
  });
  console.log("✅ Regular User created:", user.email);

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
