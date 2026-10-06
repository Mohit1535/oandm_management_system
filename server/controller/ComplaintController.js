import Complaint from "../models/Complaint.js";
import Employee from "../models/Employee.js";

// =======================
// Get Complaints
// =======================
export const getComplaint = async (req, res) => {
  try {
    const session = req.session;
    const { status } = req.query;

    const isAdmin = session.role === "ADMIN";

    if (isAdmin) {
      const where = {};

      if (status) {
        where.status = status;
      }

      const complaint = await Complaint.find(where)
        .populate("employeeId")
        .sort({ createdAt: -1 })
        .lean();

      const result = complaint.map((c) => ({
        ...c,
        id: c._id.toString(),
        employee: c.employeeId,
        employeeId: c.employeeId?._id?.toString(),
      }));

      return res.json({
        success: true,
        result,
      });
    } else {
      const employee = await Employee.findOne({
        userId: session.userId,
      });

      if (!employee) {
        return res.status(404).json({
          success: false,
          error: "Employee not found",
        });
      }

      const complaintHistory = await Complaint.find({
        employeeId: employee._id,
      }).sort({ createdAt: -1 });

      return res.json({
        success: true,
        data: complaintHistory,
        employee: {
          ...employee.toObject(),
          id: employee._id.toString(),
        },
      });
    }
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch complaints",
    });
  }
};

// =======================
// Create Complaint
// =======================
export const createComplaint = async (req, res) => {
  try {
    const session = req.session;

    const employee = await Employee.findOne({
      userId: session.userId,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      });
    }

    const {
      status,
      type,
      image,
      assetsName,
      Sites,
      branchName,
    } = req.body;

    if (
      !status ||
      !type ||
      !image ||
      !assetsName ||
      !Sites ||
      !branchName
    ) {
      return res.status(400).json({
        success: false,
        error: "Please enter all required fields",
      });
    }

    // Today's Date
    const complaintDate = new Date();
    complaintDate.setHours(0, 0, 0, 0);

    const complaint = await Complaint.create({
      employeeId: employee._id,
      complaintDate,
      status,
      type,
      image,
      assetsName,
      Sites,
      branchName,
    });

    return res.status(201).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: "Failed to create complaint",
    });
  }
};

// =======================
// Update Complaint
// =======================
export const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["SOLVED", "UNSOLVED"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      {
        status,
      },
      {
        new: true,
      }
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: "Complaint not found",
      });
    }

    return res.json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: "Failed to update complaint",
    });
  }
};