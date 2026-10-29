import { Router } from "express";
import {
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getMyEmployee,
} from "../controller/EmployeeController.js";
import { protect } from "../middleware/auth.js";
import multer from "multer"
const parseEmployeeForm=multer().none();


const employeeRouter = Router();
employeeRouter.get("/me",parseEmployeeForm,protect,getMyEmployee);
employeeRouter.get("/", protect,parseEmployeeForm, getEmployee);
employeeRouter.post("/", protect,parseEmployeeForm, createEmployee);
employeeRouter.put("/:id", protect,parseEmployeeForm, updateEmployee);
employeeRouter.delete("/:id", protect,parseEmployeeForm, deleteEmployee);

export default employeeRouter;