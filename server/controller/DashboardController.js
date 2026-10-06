import Complaint from "../models/Complaint.js";
import Employee from "../models/Employee.js";
import Sites from "../models/Sites.js";
import Branches from "../models/Branch.js";

export const getDashboard = async (req, res) => {
  try {
    const session = req.session;

    console.log("SESSION:", session);

    // ================= ADMIN =================

    if (session.role === "ADMIN") {
      const [
        totalEmployees,
        complaints,
        solvedComplaints,
        pendingComplaints,
        totalSites,
        totalBranches,
      ] = await Promise.all([
        Employee.countDocuments({
          isDeleted: { $ne: true },
        }),

        Complaint.countDocuments(),

        Complaint.countDocuments({
          status: "SOLVED",
        }),

        Complaint.countDocuments({
          status: "PENDING",
        }),

        Sites.countDocuments(),

        Branches.countDocuments(),
      ]);

      const response = {
        role: "ADMIN",
        totalEmployees,
        complaints,
        solvedComplaints,
        pendingComplaints,
        totalSites,
        totalBranches,
      };

      console.log("ADMIN DASHBOARD:", response);

      return res.status(200).json(response);
    }

    // ================= EMPLOYEE =================

    const employee = await Employee.findOne({
      userId: session.userId,
    });

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    // Employee ke assigned sites aur branches
    const totalSites = employee.sites?.length || 0;
    const totalBranches = employee.branchName?.length || 0;

    const [
      complaints,
      solvedComplaints,
      pendingComplaints,
    ] = await Promise.all([
      Complaint.countDocuments({
        employeeId: employee._id,
      }),

      Complaint.countDocuments({
        employeeId: employee._id,
        status: "SOLVED",
      }),

      Complaint.countDocuments({
        employeeId: employee._id,
        status: "PENDING",
      }),
    ]);

    const response = {
      role: "EMPLOYEE",
      totalSites,
      totalBranches,
      complaints,
      solvedComplaints,
      pendingComplaints,
    };

    console.log("EMPLOYEE DASHBOARD:", response);

    return res.status(200).json(response);

  } catch (error) {
    console.log("DASHBOARD ERROR:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};