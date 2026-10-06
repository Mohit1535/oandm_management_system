import {getSite,createSite,deleteSite} from "../controller/siteController.js";
import { protect } from "../middleware/auth.js";
import Router from "express";
const siteRouter=Router();
siteRouter.get("/",protect,getSite);
siteRouter.post("/",protect,createSite);
siteRouter.delete("/",protect,deleteSite)
export default siteRouter;