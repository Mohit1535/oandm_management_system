
import Complaint from "../models/Complaint.js";
import Employee from "../models/Employee.js";

// ==========================================
// HELPER: NORMALIZE VALUES INTO ARRAYS
// ==========================================
const normalizeStringArray = (value) => {
const values = Array.isArray(value)
? value
: value
? [value]
: [];

return values
.map((item) =>
typeof item === "string" ? item.trim() : ""
)
.filter(Boolean);
};

// ==========================================
// HELPER: VALIDATE DATE
// ==========================================
const isValidDate = (value) => {
return (
Boolean(value) &&
!Number.isNaN(new Date(value).getTime())
);
};

// ==========================================
// HELPER: CLEAN DESCRIPTION FOR VALIDATION
// ==========================================
const getPlainDescription = (description) => {
if (typeof description !== "string") {
return "";
}

return description
.replace(/<[^>]*>/g, "")
.replace(/ /g, " ")
.replace(/&/g, "&")
.trim();
};

// ==========================================
// HELPER: NORMALIZE UPLOADED FILE PATH
// ==========================================
const getAttachmentPath = (file) => {
  if (!file) {
    return "";
  }

  return `/uploads/${file.filename}`;
};
// ==========================================
// GET COMPLAINTS
// ==========================================
export const getComplaint = async (req, res) => {
try {
const session = req.session;


if (!session?.role) {
  return res.status(401).json({
    success: false,
    message: "Unauthorized",
  });
}

// ADMIN: Get all complaints, optionally filtered by status.
if (session.role === "ADMIN") {
  const filter = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const complaints = await Complaint.find(filter)
    .populate(
      "employeeId",
      "firstName lastName email userName"
    )
    .sort({ createdAt: -1 })
    .lean();

  const data = complaints.map((complaint) => ({
    ...complaint,
    id: complaint._id.toString(),
    employee: complaint.employeeId,
    employeeId:
      complaint.employeeId?._id?.toString() || null,
  }));

  return res.status(200).json({
    success: true,
    data,
  });
}

// EMPLOYEE: Get only complaints belonging to this employee.
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

  const complaints = await Complaint.find({
    employeeId: employee._id,
  })
    .sort({ createdAt: -1 })
    .lean();

  const data = complaints.map((complaint) => ({
    ...complaint,
    id: complaint._id.toString(),
    employeeId:
      complaint.employeeId?.toString() || null,
  }));

  return res.status(200).json({
    success: true,
    data,
    employee: {
      ...employee.toObject(),
      id: employee._id.toString(),
    },
  });
}

return res.status(403).json({
  success: false,
  message: "Access denied",
});


} catch (error) {
console.error("Get Complaint Error:", error);


return res.status(500).json({
  success: false,
  message: "Failed to fetch complaints",
  error: error.message,
});


}
};

// ==========================================
// CREATE COMPLAINT
// ==========================================
export const createComplaint = async (req, res) => {
try {
console.log("========== CREATE COMPLAINT ==========");
console.log("Request Body:", req.body);
console.log("Session:", req.session);
console.log("Uploaded Attachment:", req.file);

// 1. Verify the logged-in user.
const session = req.session;

if (!session?.userId) {
  return res.status(401).json({
    success: false,
    message: "Unauthorized. Please log in again.",
  });
}

// 2. Find the employee associated with the logged-in user.
const employee = await Employee.findOne({
  userId: session.userId,
});

if (!employee) {
  console.error(
    "Employee not found for userId:",
    session.userId
  );

  return res.status(404).json({
    success: false,
    message:
      "Employee not found for the logged-in user.",
  });
}

// 3. Extract the submitted fields.
const {
  assetsName,
  complaintDate,
  description,
} = req.body;

// 4. Normalize multiple sites and branches.
const sites = normalizeStringArray(req.body.sites);
const branchName = normalizeStringArray(
  req.body.branchName
);

// 5. Validate asset name.
if (
  typeof assetsName !== "string" ||
  !assetsName.trim()
) {
  return res.status(400).json({
    success: false,
    message: "Asset name is required.",
  });
}

// 6. Validate complaint date.
if (!isValidDate(complaintDate)) {
  return res.status(400).json({
    success: false,
    message: "Please provide a valid complaint date.",
  });
}

// 7. Validate description.
const plainDescription =
  getPlainDescription(description);

if (!plainDescription) {
  return res.status(400).json({
    success: false,
    message: "Complaint description is required.",
  });
}

// 8. Validate selected sites.
if (sites.length === 0) {
  return res.status(400).json({
    success: false,
    message: "Please select at least one site.",
  });
}

// 9. Validate selected branches.
if (branchName.length === 0) {
  return res.status(400).json({
    success: false,
    message: "Please select at least one branch.",
  });
}

// 10. Get the uploaded attachment path, if provided.
const attachment = getAttachmentPath(req.file);

// 11. Create the complaint in MongoDB.
const complaint = await Complaint.create({
  employeeId: employee._id,
  assetsName: assetsName.trim(),
  complaintDate: new Date(complaintDate),
  description: description.trim(),
  sites,
  branchName,
  attachment,
});

console.log(
  "Complaint created successfully:",
  complaint._id.toString()
);

console.log(
  "Saved attachment path:",
  complaint.attachment
);

// 12. Prepare the response.
const data = {
  ...complaint.toObject(),
  id: complaint._id.toString(),
  employeeId: complaint.employeeId.toString(),
};

// 13. Return the successful response.
return res.status(201).json({
  success: true,
  message: "Complaint successfully created.",
  data,
});


} catch (error) {
console.error(
"========== CREATE COMPLAINT ERROR =========="
);
console.error("Error name:", error.name);
console.error("Error message:", error.message);
console.error("Full error:", error);


return res.status(500).json({
  success: false,
  message: "Failed to create complaint.",
  error: error.message,
});


}
};

// ==========================================
// UPDATE COMPLAINT
// ==========================================
export const updateComplaint = async (req, res) => {
try {
const { id } = req.params;
const session = req.session;


if (!session?.role) {
  return res.status(401).json({
    success: false,
    message: "Unauthorized",
  });
}

// ======================================
// ADMIN: UPDATE STATUS ONLY
// ======================================
if (session.role === "ADMIN") {
  const { status } = req.body;

  if (
    typeof status !== "string" ||
    !status.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Status is required",
    });
  }

  const complaint =
    await Complaint.findByIdAndUpdate(
      id,
      {
        status: status.trim(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found",
    });
  }

  return res.status(200).json({
    success: true,
    message:
      "Complaint status updated successfully",
    complaint,
  });
}

// ======================================
// EMPLOYEE: UPDATE OWN COMPLAINT
// ======================================
if (session.role === "EMPLOYEE") {
  // Find the logged-in employee.
  const employee = await Employee.findOne({
    userId: session.userId,
  });

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: "Employee not found",
    });
  }

  // Extract submitted fields.
  const {
    assetsName,
    complaintDate,
    description,
  } = req.body;

  // Normalize sites and branches.
  const sites = normalizeStringArray(
    req.body.sites
  );

  const branchName = normalizeStringArray(
    req.body.branchName
  );

  // Validate the submitted fields.
  if (
    typeof assetsName !== "string" ||
    !assetsName.trim() ||
    !isValidDate(complaintDate) ||
    !getPlainDescription(description) ||
    sites.length === 0 ||
    branchName.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Please fill in all required fields.",
    });
  }

  // Prepare the update data.
  const updateData = {
    assetsName: assetsName.trim(),
    complaintDate: new Date(complaintDate),
    description: description.trim(),
    sites,
    branchName,
  };

  // Update the attachment only when a new file is uploaded.
  // Otherwise, preserve the existing attachment.
  if (req.file) {
    updateData.attachment =
      getAttachmentPath(req.file);
  }

  // Update only this employee's complaint.
  const complaint =
    await Complaint.findOneAndUpdate(
      {
        _id: id,
        employeeId: employee._id,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message:
        "Complaint not found or you are not authorized.",
    });
  }

  // Prepare the response.
  const data = {
    ...complaint.toObject(),
    id: complaint._id.toString(),
    employeeId:
      complaint.employeeId?.toString() || null,
  };

  return res.status(200).json({
    success: true,
    message: "Complaint updated successfully.",
    data,
  });
}

// Other roles cannot update complaints.
return res.status(403).json({
  success: false,
  message:
    "You are not authorized to update this complaint.",
});


} catch (error) {
console.error("Update Complaint Error:", error);

return res.status(500).json({
  success: false,
  message: "Internal server error",
  error: error.message,
});


}
};

