import Employee from "../models/Employee.js";
import Utr from "../models/Utr.js";

// ================= GET UTR =================
export  const getUtr = async (req, res) => {
  try {
    const session = req.session;

    if (!session || !session.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const filter = {};

    // ================= MONTH FILTER =================
    if (req.query.months) {
      filter.Month = req.query.months;
    }

    // ================= ADMIN =================
    if (session.role === "ADMIN") {
      const utr = await Utr.find(filter).sort({ Month: -1 });

      return res.status(200).json({
        success: true,
        utr,
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

      // Employee can see only allotted sites
      filter.sites = {
        $in: employee.sites || [],
      };

      // Employee can see only allotted branches
      filter.branches = {
        $in: employee.branchName || [],
      };

      const utr = await Utr.find(filter).sort({ Month: -1 });

      return res.status(200).json({
        success: true,
        utr,
      });
    }

    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  } catch (error) {
    console.error("GET UTR ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= CREATE UTR =================
export const createUtr = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      amounts,
      months,
      sites,
      branches,
    } = req.body;

    // ================= REQUIRED FIELDS =================
    if (
      !firstName ||
      !lastName ||
      !amounts ||
      !months ||
      !sites ||
      !branches
    ) {
      return res.status(400).json({
        success: false,
        message: "Fill all the required fields",
      });
    }

    const session = req.session;

    if (!session || !session.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ================= ADMIN =================
    if (session.role === "ADMIN") {
      const utr = await Utr.create({
        firstName,
        lastName,
        amounts,
        Month: months,
        sites: Array.isArray(sites) ? sites : [],
        branches: Array.isArray(branches) ? branches : [],
      });

      return res.status(201).json({
        success: true,
        utr,
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

      const selectedSites = Array.isArray(sites) ? sites : [];
      const selectedBranches = Array.isArray(branches)
        ? branches
        : [];

      // ================= CHECK SITE ALLOTMENT =================
      const invalidSite = selectedSites.some(
        (site) => !employee.sites?.includes(site)
      );

      if (invalidSite) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to select this site",
        });
      }

      // ================= CHECK BRANCH ALLOTMENT =================
      const invalidBranch = selectedBranches.some(
        (branch) => !employee.branchName?.includes(branch)
      );

      if (invalidBranch) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to select this branch",
        });
      }

      const utr = await Utr.create({
        firstName,
        lastName,
        amounts,
        Month: months,
        sites: selectedSites,
        branches: selectedBranches,
      });

      return res.status(201).json({
        success: true,
        utr,
      });
    }

    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  } catch (error) {
    console.error("CREATE UTR ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create UTR",
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
    const session = req.session;
    const { id } = req.params;

    const {
      firstName,
      lastName,
      amounts,
      months,
      sites,
      branches,
    } = req.body;

    // ================= SESSION CHECK =================
    if (!session || !session.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ================= ADMIN =================
    if (session.role === "ADMIN") {
      const utr = await Utr.findByIdAndUpdate(
        id,
        {
          firstName,
          lastName,
          amounts,
          Month: months,
          sites: Array.isArray(sites) ? sites : [],
          branches: Array.isArray(branches) ? branches : [],
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!utr) {
        return res.status(404).json({
          success: false,
          message: "UTR not found",
        });
      }

      return res.status(200).json({
        success: true,
        utr,
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

      const selectedSites = Array.isArray(sites) ? sites : [];
      const selectedBranches = Array.isArray(branches)
        ? branches
        : [];

      // ================= SITE PERMISSION =================
      const invalidSite = selectedSites.some(
        (site) => !employee.sites?.includes(site)
      );

      if (invalidSite) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to select this site",
        });
      }

      // ================= BRANCH PERMISSION =================
      const invalidBranch = selectedBranches.some(
        (branch) => !employee.branchName?.includes(branch)
      );

      if (invalidBranch) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to select this branch",
        });
      }

      const utr = await Utr.findByIdAndUpdate(
        id,
        {
          firstName,
          lastName,
          amounts,
          Month: months,
          sites: selectedSites,
          branches: selectedBranches,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!utr) {
        return res.status(404).json({
          success: false,
          message: "UTR not found",
        });
      }

      return res.status(200).json({
        success: true,
        utr,
      });
    }

    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  } catch (error) {
    console.error("UPDATE UTR ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update UTR",
    });
  }
};
