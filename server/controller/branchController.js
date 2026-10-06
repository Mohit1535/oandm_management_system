import Branches from "../models/Branch.js";

// ===============================
// GET ALL BRANCHES
// ===============================
export const getBranch = async (req, res) => {
  try {
    const session = req.session;

    if (!session) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    let branches;

    if (session.role === "ADMIN") {
      // ADMIN -> All branches
      branches = await Branches.find().sort({
        branchName: 1,
      });
    } else {
      // EMPLOYEE -> Only allocated branch
      branches = await Branches.find({
        branchName: session.employee?.branches,
      }).sort({
        branchName: 1,
      });
    }

    return res.status(200).json(branches);

  } catch (error) {
    console.error("Get Branch Error:", error);

    return res.status(500).json({
      error: "Failed to fetch branches",
    });
  }
};


// ===============================
// CREATE BRANCH
// ===============================
export const createBranch = async (req, res) => {
  try {
    const session = req.session;

    // Only ADMIN can create branch
    if (session.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    const { branchName } = req.body;

    // Validate branch name
    if (!branchName || !branchName.trim()) {
      return res.status(400).json({
        success: false,
        error: "Branch Name  is required",
      });
    }

    const trimmedBranchName = branchName.trim();

    // Check duplicate branch
    const existingBranch = await Branches.findOne({
      branchName: trimmedBranchName,
    });

    if (existingBranch) {
      return res.status(409).json({
        success: false,
        error: "Branch already exists",
      });
    }

    const newBranch = await Branches.create({
      branchName: trimmedBranchName,
    });

    return res.status(201).json({
      success: true,
      message: "Branch created successfully",
      branch: newBranch,
    });
  } catch (error) {
    console.error("Create Branch Error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to create branch",
    });
  }
};


// ===============================
// DELETE BRANCH
// ===============================
export const deleteBranch = async (req, res) => {
  try {
    const session = req.session;

    // Only ADMIN can delete branch
    if (session.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    const { branchName } = req.body;

    if (!branchName || !branchName.trim()) {
      return res.status(400).json({
        success: false,
        error: "Branch name is required",
      });
    }

    const deletedBranch = await Branches.findOneAndDelete({
      branchName: branchName.trim(),
    });

    // Branch not found
    if (!deletedBranch) {
      return res.status(404).json({
        success: false,
        error: "Branch not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Branch deleted successfully",
      branch: deletedBranch,
    });
  } catch (error) {
    console.error("Delete Branch Error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to delete branch",
    });
  }
};