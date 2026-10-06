
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    console.log("========== AUTH CHECK ==========");

    const authHeader = req.headers.authorization;

    console.log("Authorization Header:", authHeader);
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

    if (!authHeader) {
      console.log("❌ Authorization header missing");

      return res.status(401).json({
        error: "Authorization header missing",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      console.log("❌ Invalid Authorization format");

      return res.status(401).json({
        error: "Invalid authorization format",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("Token received:", !!token);

    const session = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("✅ JWT VERIFIED");
    console.log("Session:", session);

    req.session = session;

    next();
  } catch (error) {
    console.log("========== JWT ERROR ==========");
    console.log(error.name);
    console.log(error.message);
    console.log("===============================");

    return res.status(401).json({
      error: "Unauthorized",
      details: error.message,
    });
  }
};

export const protectAdmin = (req, res, next) => {
  if (!req.session) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  if (req.session.role !== "ADMIN") {
    return res.status(403).json({
      error: "Admin access denied",
    });
  }

  next();
};
