import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

// ============================================================
// GET EMPLOYEES
// ============================================================

export const getMyEmployee = async (req, res) => {
  try {
    const session = req.session;

    if (!session?.userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated.",
      });
    }

    const employee = await Employee.findOne({
      userId: session.userId,
    })
      .select("firstName lastName email userName sites branchName status userId")
      .lean();

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    return res.status(200).json({
      success: true,
      employee: {
        ...employee,
        id: employee._id.toString(),
        sites: Array.isArray(employee.sites)
          ? employee.sites
          : employee.sites
            ? [employee.sites]
            : [],
        branchName: Array.isArray(employee.branchName)
          ? employee.branchName
          : employee.branchName
            ? [employee.branchName]
            : [],
      },
    });
  } catch (error) {
    console.error("GET MY EMPLOYEE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch employee details.",
      error: error.message,
    });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const { sites, branchName } = req.query;

    const filter = {};

    if (sites) {
      filter.sites = sites;
    }

    if (branchName) {
      filter.branchName = branchName;
    }

    const employees = await Employee.find(filter)
      .populate(
        "userId",
        "userName role"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json(employees);

  } catch (error) {
    console.error(
      "GET EMPLOYEE ERROR:",
      error
    );

    return res.status(500).json({
      error: error.message,
    });
  }
};

// ============================================================
// CREATE EMPLOYEE
// ============================================================

export const createEmployee = async (req, res) => {
  try {
    console.log("========== CREATE EMPLOYEE ==========");
    console.log("BODY:", req.body);

    let {
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

    // ========================================================
    // NORMALIZE
    // ========================================================

  
    

    // ========================================================
    // VALIDATION
    // ========================================================

    if (
      !firstName ||
      !lastName ||
      !email ||
      !userName ||
      !phone ||
      !password
    ) {
      return res.status(400).json({
        error: "All required fields are required.",
      });
    }

    // ========================================================
    // NORMALIZE ARRAYS
    // ========================================================

    const employeeSites = Array.isArray(sites)
      ? sites
      : sites
      ? [sites]
      : [];

    const employeeBranches = Array.isArray(
      branchName
    )
      ? branchName
      : branchName
      ? [branchName]
      : [];

    if (employeeSites.length === 0) {
      return res.status(400).json({
        error: "At least one site is required.",
      });
    }

    if (employeeBranches.length === 0) {
      return res.status(400).json({
        error: "At least one branch is required.",
      });
    }

    // ========================================================
    // CHECK USERNAME IN USERS
    // ========================================================

    const existingUser = await User.findOne({
      userName,
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Username already exists.",
      });
    }

    // ========================================================
    // CHECK USERNAME IN EMPLOYEES
    // ========================================================

    const existingEmployee =
      await Employee.findOne({
        userName,
      });

    if (existingEmployee) {
      return res.status(400).json({
        error:
          "Employee username already exists.",
      });
    }

    // ========================================================
    // HASH PASSWORD
    // ========================================================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // ========================================================
    // CREATE USER
    // ========================================================

    const user = await User.create({
      userName,
      password: hashedPassword,
      role:
        role?.trim().toUpperCase() ||
        "EMPLOYEE",
    });

    console.log(
      "USER CREATED:",
      user._id.toString()
    );

    // ========================================================
    // CREATE EMPLOYEE
    // ========================================================

    try {
      const employee =
        await Employee.create({
          userId: user._id,

          // Keep username synchronized
          userName: user.userName,

          firstName,
          lastName,
          phone,
          email,

          sites: employeeSites,

          branchName:
            employeeBranches,

          status:
            status || "ACTIVE",
        });

      console.log(
        "EMPLOYEE CREATED:",
        employee._id.toString()
      );

      return res.status(201).json({
        success: true,
        message:
          "Employee created successfully",
        employee,
      });

    } catch (employeeError) {
      console.error(
        "EMPLOYEE CREATE ERROR:",
        employeeError
      );

      // Roll back User
      await User.findByIdAndDelete(
        user._id
      );

      if (employeeError.code === 11000) {
        return res.status(400).json({
          error:
            "Employee username already exists.",
        });
      }

      return res.status(500).json({
        error: employeeError.message,
      });
    }

  } catch (error) {
    console.error(
      "CREATE EMPLOYEE ERROR:",
      error
    );

    if (error.code === 11000) {
      return res.status(400).json({
        error: "Username already exists.",
      });
    }

    return res.status(500).json({
      error: error.message,
    });
  }
};

// ============================================================
// UPDATE EMPLOYEE
// ============================================================

export const updateEmployee = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    console.log(
      "========== UPDATE EMPLOYEE =========="
    );
    console.log("ID:", id);
    console.log("BODY:", req.body);

    let {
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

    // ========================================================
    // FIND EMPLOYEE
    // ========================================================

    const employee =
      await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found.",
      });
    }

    // ========================================================
    // FIND USER
    // ========================================================

    const user = await User.findById(
      employee.userId
    );

    if (!user) {
      return res.status(404).json({
        error: "Linked user not found.",
      });
    }

    // ========================================================
    // NORMALIZE
    // ========================================================

    if (firstName !== undefined) {
      firstName = firstName.trim();
    }

    if (lastName !== undefined) {
      lastName = lastName.trim();
    }

    if (email !== undefined) {
      email = email.trim().toLowerCase();
    }

    if (phone !== undefined) {
      phone = phone.trim();
    }

    if (userName !== undefined) {
      userName = userName
        .trim()
        .toLowerCase();
    }

    // ========================================================
    // CHECK USERNAME
    // ========================================================

    if (
      userName !== undefined &&
      userName !== user.userName
    ) {
      const existingUser =
        await User.findOne({
          userName,
          _id: {
            $ne: user._id,
          },
        });

      if (existingUser) {
        return res.status(400).json({
          error:
            "Username already exists.",
        });
      }

      const existingEmployee =
        await Employee.findOne({
          userName,
          _id: {
            $ne: employee._id,
          },
        });

      if (existingEmployee) {
        return res.status(400).json({
          error:
            "Employee username already exists.",
        });
      }
    }

    // ========================================================
    // UPDATE EMPLOYEE
    // ========================================================

    if (firstName !== undefined) {
      employee.firstName =
        firstName;
    }

    if (lastName !== undefined) {
      employee.lastName =
        lastName;
    }

    if (email !== undefined) {
      employee.email = email;
    }

    if (phone !== undefined) {
      employee.phone = phone;
    }

    if (sites !== undefined) {
      employee.sites = Array.isArray(
        sites
      )
        ? sites
        : [sites];
    }

    if (branchName !== undefined) {
      employee.branchName =
        Array.isArray(branchName)
          ? branchName
          : [branchName];
    }

    if (
      status !== undefined &&
      status !== ""
    ) {
      employee.status = status;
    }

    // ========================================================
    // UPDATE USERNAME
    // ========================================================

    if (userName !== undefined) {
      user.userName = userName;

      // IMPORTANT:
      // Keep both collections synchronized
      employee.userName =
        userName;
    }

    // ========================================================
    // UPDATE ROLE
    // ========================================================

    if (
      role !== undefined &&
      role !== ""
    ) {
      user.role =
        role.trim().toUpperCase();
    }

    // ========================================================
    // UPDATE PASSWORD
    // ========================================================

    if (
      password !== undefined &&
      password.trim() !== ""
    ) {
      user.password =
        await bcrypt.hash(
          password,
          10
        );
    }

    // ========================================================
    // SAVE
    // ========================================================

    await user.save();
    await employee.save();

    console.log(
      "UPDATED USER:",
      user
    );

    console.log(
      "UPDATED EMPLOYEE:",
      employee
    );

    return res.status(200).json({
      success: true,
      message:
        "Employee updated successfully",
      employee,
    });

  } catch (error) {
    console.error(
      "UPDATE EMPLOYEE ERROR:",
      error
    );

    if (error.code === 11000) {
      return res.status(400).json({
        error:
          "Username already exists.",
      });
    }

    return res.status(500).json({
      error: error.message,
    });
  }
};

// ============================================================
// DELETE EMPLOYEE
// ============================================================

export const deleteEmployee = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const employee =
      await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found.",
      });
    }

    // Delete linked User
    await User.findByIdAndDelete(
      employee.userId
    );

    // Delete Employee
    await Employee.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message:
        "Employee deleted successfully",
    });

  } catch (error) {
    console.error(
      "DELETE EMPLOYEE ERROR:",
      error
    );

    return res.status(500).json({
      error: error.message,
    });
  }
};