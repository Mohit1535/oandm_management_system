import Sites from "../models/Sites.js";

// ===============================
// GET SITES
// ===============================
export const getSite = async (req, res) => {
  try {
    const session = req.session;

    if (!session) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    let sites;

    if (session.role === "ADMIN") {
      // ADMIN -> All sites
      sites = await Sites.find().sort({ siteName: 1 });
    } else {
      // EMPLOYEE -> Only allocated site
      sites = await Sites.find({
        siteName: session.employee?.sites,
      }).sort({ siteName: 1 });
    }

    return res.status(200).json(sites);
  } catch (error) {
    console.error("Get Sites Error:", error);

    return res.status(500).json({
      error: "Failed to fetch sites",
    });
  }
};


// ===============================
// CREATE SITE
// ===============================
export const createSite = async (req, res) => {
  try {
    const session = req.session;

    // Only ADMIN can create site
    if (!session || session.role !== "ADMIN") {
      return res.status(403).json({
        error: "Only admin can create a site",
      });
    }

    const { siteName } = req.body;

    // Validate site name
    if (!siteName || !siteName.trim()) {
      return res.status(400).json({
        error: "Site name is required",
      });
    }

    const trimmedSiteName = siteName.trim();

    // Check duplicate site
    const existingSite = await Sites.findOne({
      siteName: trimmedSiteName,
    });

    if (existingSite) {
      return res.status(409).json({
        error: "Site already exists",
      });
    }

    // Create site
    const site = await Sites.create({
      siteName: trimmedSiteName,
    });

    return res.status(201).json({
      success: true,
      message: "Site created successfully",
      site,
    });
  } catch (error) {
    console.error("Create Site Error:", error);

    return res.status(500).json({
      error: "Failed to create site",
    });
  }
};


// ===============================
// DELETE SITE
// ===============================
export const deleteSite = async (req, res) => {
  try {
    const session = req.session;

    // Only ADMIN can delete site
    if (!session || session.role !== "ADMIN") {
      return res.status(403).json({
        error: "Only admin can delete a site",
      });
    }

    const { siteName } = req.body;

    if (!siteName || !siteName.trim()) {
      return res.status(400).json({
        error: "Site name is required",
      });
    }

    const site = await Sites.findOneAndDelete({
      siteName
    });

    if (!site) {
      return res.status(404).json({
        error: "Site not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Site deleted successfully",
      site,
    });
  } catch (error) {
    console.error("Delete Site Error:", error);

    return res.status(500).json({
      error: "Failed to delete site",
    });
  }
};