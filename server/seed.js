import "dotenv/config";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import bcrypt from "bcrypt";

export async function registerAdmin() {
  try {
    await connectDB();

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const TemporaryPassword = "Sundigo@2026";

    if (!ADMIN_EMAIL) {
      console.error("Missing ADMIN_EMAIL");
      process.exit(1);
    }

    const existingDatabase = await User.findOne({
      userName: ADMIN_EMAIL,
    });

    if (existingDatabase) {
      console.log("User already exists as role:", existingDatabase.role);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(TemporaryPassword, 10);

    await User.create({
      userName: ADMIN_EMAIL,
      password: hashedPassword,
      role: "ADMIN",
    });

    console.log("Admin user created successfully.");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

registerAdmin();