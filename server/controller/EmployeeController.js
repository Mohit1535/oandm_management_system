import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

// ================= GET =================
export const getEmployee = async (req, res) => {
  try {
    const { sites, branchName } = req.query;

    const filter = {};

    if (sites) filter.sites = sites;
    if (branchName) filter.branchName = branchName;

    const employees = await Employee.find(filter)
      .populate("userId", "userName email role")
      .sort({ createdAt: -1 });

    res.status(200).json(employees);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// ================= CREATE =================
export const createEmployee = async (req, res) => {
  try {

    console.log("BODY :", req.body);

    const {
      firstName,
      lastName,
      email,
      userName,
      phone,
      sites,
      branchName,
      password,
      role,
      status
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !userName ||
      !phone ||
      !sites ||
      !branchName ||
      !password ||
      !status
    ) {
      return res.status(400).json({
        error: "All fields are required.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "Email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
    
      password: hashedPassword,
      role,
    });

    console.log("User Created :", user);

    try {

      const employee = await Employee.create({
        userId: user._id,
        firstName,
        lastName,
        userName,
        phone,
        email,
        sites,
        branchName,
        status
      });

      console.log("Employee Created :", employee);

      return res.status(201).json(employee);

    } catch (employeeError) {

      console.log(employeeError);

      // Delete created user if employee creation fails
      await User.findByIdAndDelete(user._id);

      return res.status(500).json({
        error: employeeError.message,
      });
    }

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// ================= UPDATE =================
// ================= UPDATE =================
// ================= UPDATE =================
// ================= UPDATE =================

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("ID:", id);
    console.log("BODY:", req.body);

    const {
      firstName,
      lastName,
      email,
      userName,
      phone,
      sites,
      branchName,
      password,
      role,
      status,
    } = req.body;

    // ============================================
    // FIND EMPLOYEE
    // ============================================

    const employee = await Employee.findById(id);

    console.log("Employee:", employee);

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    // ============================================
    // FIND LINKED USER
    // ============================================

    const user = await User.findById(employee.userId);

    console.log("Linked User:", user);

    if (!user) {
      return res.status(404).json({
        error: "Linked user not found",
      });
    }

    // ============================================
    // UPDATE EMPLOYEE
    // ============================================

    if (firstName !== undefined) {
      employee.firstName = firstName;
    }

    if (lastName !== undefined) {
      employee.lastName = lastName;
    }

    if (email !== undefined) {
      employee.email = email;
    }

    if (phone !== undefined) {
      employee.phone = phone;
    }

    if (sites !== undefined) {
      employee.sites = Array.isArray(sites)
        ? sites
        : [sites];
    }

    if (branchName !== undefined) {
      employee.branchName = Array.isArray(branchName)
        ? branchName
        : [branchName];
    }

    if (status !== undefined) {
      employee.status = status;
    }

    await employee.save();

    // ============================================
    // UPDATE USER
    // ============================================

    if (userName !== undefined && userName.trim() !== "") {
      user.userName = userName.trim();
    }

    if (email !== undefined && email.trim() !== "") {
      user.email = email.trim();
    }

    if (role !== undefined && role !== "") {
      user.role = role;
    }

    // ============================================
    // UPDATE PASSWORD
    // ============================================

    if (password !== undefined && password.trim() !== "") {
      user.password = await bcrypt.hash(
        password,
        10
      );
    }

    await user.save();

    console.log("Updated User:", user);
    console.log(
      "Updated Employee:",
      employee
    );

    // ============================================
    // RESPONSE
    // ============================================

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee,
    });

  } catch (error) {
    console.log("UPDATE ERROR:", error);

    // ============================================
    // DUPLICATE USERNAME / EMAIL
    // ============================================

    if (error.code === 11000) {
      return res.status(400).json({
        error:
          "Username or email already exists.",
      });
    }

    return res.status(500).json({
      error: error.message,
    });
  }
};
// ================= DELETE =================
export const deleteEmployee = async (req, res) => {

  try {

    const { id } = req.params;

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    await User.findByIdAndDelete(employee.userId);

    await Employee.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
};