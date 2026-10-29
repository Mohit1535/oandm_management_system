import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ================= LOGIN =================

export const login = async (req, res) => {
  try {
    console.log("========== LOGIN ==========");
    console.log("LOGIN BODY:", req.body);
 
    let { userName, password, role } = req.body;

    // ============================================
    // VALIDATION
    // ============================================

    if (!userName || !password || !role) {
      return res.status(400).json({
        success: false,
        error: "Username, password and role are required",
      });
    }

    // ============================================
    // NORMALIZE
    // ============================================

    userName = userName.trim().toLowerCase();
    role = role.trim().toUpperCase();

    console.log("Username:", userName);
    console.log("Role:", role);

    // ============================================
    // FIND USER
    // ============================================

    const user = await User.findOne({
      userName,
    });

    console.log(
      "USER FOUND:",
      user
        ? {
            id: user._id.toString(),
            userName: user.userName,
            role: user.role,
          }
        : null
    );

    if (!user) {
      console.log("❌ USER NOT FOUND");

      return res.status(401).json({
        success: false,
        error: "Invalid username or password",
      });
    }

    // ============================================
    // CHECK ROLE
    // ============================================

    console.log("Database role:", user.role);
    console.log("Requested role:", role);

    if (user.role !== role) {
      console.log("❌ ROLE MISMATCH");

      return res.status(401).json({
        success: false,
        error: "Invalid role",
      });
    }

    // ============================================
    // CHECK PASSWORD
    // ============================================

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    console.log(
      "PASSWORD VALID:",
      isPasswordValid
    );

    if (!isPasswordValid) {
      console.log("❌ PASSWORD DOES NOT MATCH");

      return res.status(401).json({
        success: false,
        error: "Invalid username or password",
      });
    }

    // ============================================
    // CREATE JWT
    // ============================================

    const payload = {
      userId: user._id.toString(),
      userName: user.userName,
      role: user.role,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.log("✅ LOGIN SUCCESS");

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: payload,
    });

  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// ================= SESSION =================

export const session = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.session,
    });
  } catch (error) {
    console.error("SESSION ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// ================= CHANGE PASSWORD =================

export const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error:
          "Current password and new password are required",
      });
    }

    const user = await User.findById(
      req.session.userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const isPasswordValid =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(
      newPassword,
      10
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {
    console.error(
      "CHANGE PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};