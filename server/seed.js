import "dotenv/config";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import bcrypt from "bcrypt";

async function registerAdmin() {
  try {
    await connectDB();

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = "sundigo@2026";

    if (!ADMIN_EMAIL) {
      console.error("❌ Missing ADMIN_EMAIL in .env");
      process.exit(1);
    }

    const userName = ADMIN_EMAIL.trim().toLowerCase();

    // Hash password
    const hashedPassword = await bcrypt.hash(
      ADMIN_PASSWORD,
      10
    );

    // Find existing admin
    const existingUser = await User.findOne({
      userName,
    });

    if (existingUser) {
      // UPDATE EXISTING USER
      existingUser.userName = userName;
      existingUser.password = hashedPassword;
      existingUser.role = "ADMIN";

      await existingUser.save();

      console.log("✅ Existing admin updated successfully");
      console.log("Username:", userName);
      console.log("Password:", ADMIN_PASSWORD);
      console.log("Role:", existingUser.role);

      process.exit(0);
    }

    // CREATE NEW ADMIN
    const admin = await User.create({
      userName,
      password: hashedPassword,
      role: "ADMIN",
    });

    console.log("✅ Admin created successfully");
    console.log("Username:", admin.userName);
    console.log("Password:", ADMIN_PASSWORD);
    console.log("Role:", admin.role);

    process.exit(0);

  } catch (error) {
    console.error("❌ ADMIN CREATION ERROR:", error);
    process.exit(1);
  }
}

registerAdmin();