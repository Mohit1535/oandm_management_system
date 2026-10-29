import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";

import employeeRouter from "./routes/EmployeeRouter.js";
import authRouter from "./routes/AuthRoute.js";
import complaintRouter from "./routes/ComplaintRoute.js";
import profileRouter from "./routes/ProfileRoute.js";
import dashboardRouter from "./routes/DashboardRoute.js";
import branchRouter from "./routes/BranchRoute.js";
import siteRouter from "./routes/SiteRoute.js";
import utrRouter from "./routes/UtrRoute.js";

const app = express();
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(
cors({
origin: process.env.FRONTEND_URL || true,
credentials: true,
})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload directory: uploads folder beside server.js
const uploadDirectory = path.join(__dirname, "uploads");

console.log("Server directory:", __dirname);
console.log("Uploads directory:", uploadDirectory);

// Serve uploaded files
app.use("/uploads", express.static(uploadDirectory));
app.use("/api/uploads", express.static(uploadDirectory));

// Health-check routes
app.get("/", (req, res) => {
res.status(200).json({
success: true,
message: "O&M API server is running",
});
});

app.get("/", (req, res) => {
res.status(200).json({
success: true,
message: "O&M API is running",
});
});

// Upload route test
app.get("/api/uploads-test", (req, res) => {
res.status(200).json({
success: true,
message: "Node.js upload route is working",
uploadDirectory,
});
});

// API routes
app.use("/api/employees", employeeRouter);
app.use("/api/auth", authRouter);
app.use("/api/complaints", complaintRouter);
app.use("/api/profile", profileRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/sites", siteRouter);
app.use("/api/branch", branchRouter);
app.use("/api/utr", utrRouter);

// Start server
async function startServer() {
try {
await connectDB();

app.listen(PORT, () => {
  console.log(`O&M server is running on port ${PORT}`);
});

} catch (error) {
console.error("Failed to start server:", error);
process.exit(1);
}
}

startServer();

export default app