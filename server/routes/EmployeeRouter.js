import { Router } from "express";
import {
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controller/EmployeeController.js";
import { protect } from "../middleware/auth.js";

const employeeRouter = Router();

employeeRouter.get("/", protect, getEmployee);
employeeRouter.post("/", protect, createEmployee);
employeeRouter.put("/:id", protect, updateEmployee);
employeeRouter.delete("/:id", protect, deleteEmployee);

export default employeeRouter;