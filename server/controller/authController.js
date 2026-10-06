import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ================= LOGIN =================

export const login = async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { userName, password, role } = req.body;

    // Check required fields
    if (!userName || !password || !role) {
      return res.status(400).json({
        success: false,
        error: "Username, password and role are required",
      });
    }

    // Find user by username
    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid username or password",
      });
    }

    // Check role
    if (user.role !== role) {
      return res.status(401).json({
        success: false,
        error: "Invalid role",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid username or password",
      });
    }

    // Create JWT payload
    const payload = {
      userId: user._id,
      userName: user.userName,
      role: user.role,
      password:user.password
    };

    // Create token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: payload,
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);

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
    console.log("SESSION ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};


// ================= CHANGE PASSWORD =================

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Current password and new password are required",
      });
    }

    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {
    console.log("CHANGE PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};