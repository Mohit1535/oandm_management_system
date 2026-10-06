import { Router } from "express";

import {
  login,
  session,
  changePassword,
} from "../controller/authController.js";

import { protect } from "../middleware/auth.js";

const authRouter = Router();

// ================= PUBLIC =================

authRouter.post("/login", login);


// ================= PROTECTED =================

authRouter.get("/session", protect, session);

authRouter.post(
  "/change-password",
  protect,
  changePassword
);

export default authRouter;