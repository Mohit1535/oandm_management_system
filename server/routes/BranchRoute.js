import { getBranch,createBranch,deleteBranch } from "../controller/branchController.js";
import Router from "express";
import { protect } from "../middleware/auth.js";
const branchRouter=Router();

branchRouter.get("/",protect,getBranch);
branchRouter.post("/",protect,createBranch);
branchRouter.delete("/",protect,deleteBranch);
export default branchRouter;