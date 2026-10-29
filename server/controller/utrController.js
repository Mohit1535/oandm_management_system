

import Utr from "../models/Utr.js";
import Employee from "../models/Employee.js";


export const getUtr = async (req, res) => {
try {
const session = req.session;

// Check authentication
if (!session?.userId || !session?.role) {
  return res.status(401).json({
    success: false,
    message: "Unauthorized. Please log in.",
  });
}

// =========================
// BUILD FILTER
// =========================
const filter = {};

if (req.query.month) {
  filter.month = req.query.month;
}

if (req.query.utrNo) {
  filter.utrNo = req.query.utrNo;
}

// =========================
// ADMIN
// =========================
if (session.role === "ADMIN") {
  const utrRecords = await Utr.find(filter)
    .populate(
      "employeeId",
      "firstName lastName utrNo month sites branches amount "
    )
    .sort({ createdAt: -1 })
    .lean();

  const data = utrRecords.map((item) => ({
    ...item,
    id: item._id.toString(),
    employee: item.employeeId || null,
    employeeId: item.employeeId?._id?.toString() || null,
  }));

  return res.status(200).json({
    success: true,
    count: data.length,
    data,
  });
}

// =========================
// EMPLOYEE
// =========================
if (
  session.role === "EMPLOYEE" ||
  session.role === "Employee"
) {
  const employee = await Employee.findOne({
    userId: session.userId,
  });

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: "Employee not found.",
    });
  }

  const employeeFilter = {
    ...filter,
    employeeId: employee._id,
  };

  const utrRecords = await Utr.find(employeeFilter)
    .sort({ createdAt: -1 })
    .lean();

  const data = utrRecords.map((item) => ({
    ...item,
    id: item._id.toString(),
    employeeId: item.employeeId?.toString() || null,
  }));

  return res.status(200).json({
    success: true,
    count: data.length,
    data,
    employee: {
      ...employee.toObject(),
      id: employee._id.toString(),
    },
  });
}

// =========================
// INVALID ROLE
// =========================
return res.status(403).json({
  success: false,
  message: "Access denied.",
});


} catch (error) {
console.error("Get UTR Error:", error);


return res.status(500).json({
  success: false,
  message: "Failed to fetch UTR records.",
  error: error.message,
});


}
};



//Create Utr//


export const createUTR = async (req, res) => {
  try {
    console.log("========== CREATE UTR ==========");
    console.log("Session:", req.session);
    console.log("Request body:", req.body);

    const session = req.session;

    // 1. Authentication validation
    if (!session?.userId || !session?.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in again.",
      });
    }

    // 2. Employee permission validation
    if (
      session.role !== "EMPLOYEE" &&
      session.role !== "Employee"
    ) {
      return res.status(403).json({
        success: false,
        message: "Only employees can create UTR records.",
        role: session.role,
      });
    }

    // 3. Find logged-in employee
    const employee = await Employee.findOne({
      userId: session.userId,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found for the logged-in user.",
      });
    }

    // 4. Extract form values
    const {
      utrNo,
      month,
      months,
      amount,
      sites,
      branches,
      
    } = req.body;

    // Support both month and months field names
    const selectedMonth = String(month || months || "").trim();

    const normalizedUtrNo = String(utrNo || "").trim();

    // 5. Normalize multiple site selections
    const normalizedSites = (
      Array.isArray(sites) ? sites : sites ? [sites] : []
    )
      .map((site) =>
        typeof site === "string"
          ? site.trim()
          : String(site?.siteName || site?.name || "").trim()
      )
      .filter(Boolean);

    // 6. Normalize multiple branch selections
    const normalizedBranches = (
      Array.isArray(branches)
        ? branches
        : branches
          ? [branches]
          : []
    )
      .map((branch) =>
        typeof branch === "string"
          ? branch.trim()
          : String(
              branch?.branchName || branch?.name || ""
            ).trim()
      )
      .filter(Boolean);

    // 7. Validate required fields
    if (!normalizedUtrNo) {
      return res.status(400).json({
        success: false,
        message: "UTR number is required.",
      });
    }

    if (!selectedMonth) {
      return res.status(400).json({
        success: false,
        message: "Please select a month.",
      });
    }

    if (
      amount === undefined ||
      amount === null ||
      String(amount).trim() === "" ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid amount.",
      });
    }

    if (normalizedSites.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one site.",
      });
    }

    if (normalizedBranches.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one branch.",
      });
    }

    // 8. Create UTR record
    const utr = await Utr.create({
      utrNo: normalizedUtrNo,
      month: selectedMonth,
      amount: Number(amount),
      sites: normalizedSites,
      branches: normalizedBranches,
      employeeId: employee._id,
      
    });

    console.log("UTR created successfully:", utr._id);

    // 9. Return success response
    return res.status(201).json({
      success: true,
      message: "UTR record created successfully.",
      data: {
        ...utr.toObject(),
        id: utr._id.toString(),
        employeeId: utr.employeeId.toString(),
      },
    });
  } catch (error) {
    console.error("Create UTR Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create UTR record.",
    });
  }
};


// ================= DELETE UTR =================
export const deleteUTR = async (req, res) => {
  try {
    const session = req.session;

    if (!session || !session.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "UTR ID is required",
      });
    }

    // ================= ADMIN =================
    if (session.role === "ADMIN") {
      const utr = await Utr.findByIdAndDelete(id);

      if (!utr) {
        return res.status(404).json({
          success: false,
          message: "UTR not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "UTR deleted successfully",
      });
    }

    // ================= EMPLOYEE =================
    if (session.role === "EMPLOYEE") {
      const employee = await Employee.findOne({
        userId: session.userId,
      });

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      const utr = await Utr.findOne({
        _id: id,
        sites: { $in: employee.sites || [] },
        branches: { $in: employee.branchName || [] },
      });

      if (!utr) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to delete this UTR",
        });
      }

      await Utr.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: "UTR deleted successfully",
      });
    }

    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  } catch (error) {
    console.error("DELETE UTR ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete UTR",
    });
  }
};



export const updateUTR = async (req, res) => {
  try {
    const { id } = req.params;
    const session = req.session;

    // Check authentication
    if (!session || !session.userId || !session.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    // Allow employees only
    if (
      session.role !== "EMPLOYEE" &&
      session.role !== "Employee"
    ) {
      return res.status(403).json({
        success: false,
        message: "Only employees can update UTR records.",
      });
    }

    // Find logged-in employee
    const employee = await Employee.findOne({
      userId: session.userId,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    // Get form data
    const { utrNo, month, amount, sites, branches } = req.body;

    // Validate required fields
    if (
      !utrNo?.trim() ||
      !month ||
      amount === undefined ||
      amount === null ||
      amount === "" ||
      !sites ||
      !branches
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Normalize multiple selections
    const normalizedSites = Array.isArray(sites)
      ? sites
      : [sites];

    const normalizedBranches = Array.isArray(branches)
      ? branches
      : [branches];

    if (
      normalizedSites.length === 0 ||
      normalizedBranches.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one site and branch.",
      });
    }

    // Update only this employee's UTR record
    const utr = await Utr.findOneAndUpdate(
      {
        _id: id,
        employeeId: employee._id,
      },
      {
        $set: {
          utrNo: utrNo.trim(),
          month,
          amount,
          sites: normalizedSites,
          branches: normalizedBranches,
          
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    // Check whether the record exists and belongs to the employee
    if (!utr) {
      return res.status(404).json({
        success: false,
        message: "UTR record not found or you are not authorized to update it.",
      });
    }

    // Prepare response
    const data = {
      ...utr.toObject(),
      id: utr._id.toString(),
      employeeId: utr.employeeId?.toString() || null,
    };

    return res.status(200).json({
      success: true,
      message: "UTR updated successfully.",
      data,
      employee: {
        ...employee.toObject(),
        id: employee._id.toString(),
      },
    });
  } catch (error) {
    console.error("Update UTR Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update the UTR record.",
    });
  }
};
