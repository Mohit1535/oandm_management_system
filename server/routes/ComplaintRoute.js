import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { createComplaint, getComplaint, updateComplaint } from "../controller/ComplaintController.js";
const complaintRouter=Router()

//get Complaint
complaintRouter.get("/",protect,getComplaint);
complaintRouter.post("/",protect,createComplaint);
complaintRouter.patch("/:id",protect,updateComplaint);

export default complaintRouter