import { createUTR,  deleteUTR,  getUtr, updateUTR } from "../controller/utrController.js";

import { Router } from "express";
import { protect } from "../middleware/auth.js";

const utrRouter = Router();

utrRouter.get("/", protect,getUtr );

utrRouter.post("/",protect,createUTR)

utrRouter.put("/:id", protect,updateUTR );

utrRouter.delete("/:id", protect,deleteUTR );

export default utrRouter;