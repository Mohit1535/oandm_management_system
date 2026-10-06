import express from "express";
import cors from "cors";
import "dotenv/config";
import multer from "multer";

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


// ================= MIDDLEWARE =================

app.use(cors());

app.use(express.json());

app.use(multer().none());


// ================= TEST =================

app.get("/", (req, res) => {
  res.send("Server is running");
});


// ================= ROUTES =================

app.use("/api/employees", employeeRouter);

app.use("/api/auth", authRouter);

app.use("/api/complaint", complaintRouter);

app.use("/api/profile", profileRouter);

app.use("/api/dashboard", dashboardRouter);

app.use("/api/sites", siteRouter);

app.use("/api/branch", branchRouter);

app.use("/api/utr", utrRouter);


// ================= DATABASE =================

await connectDB();


// ================= SERVER =================

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});