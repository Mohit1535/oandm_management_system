import { Router } from "express";

import {
getComplaint,
createComplaint,
updateComplaint,
} from "../controller/ComplaintController.js";

import { protect } from "../middleware/auth.js";
import upload from "../middleware/uploadImage.js";

const complaintRouter = Router();

// Fetch complaints
complaintRouter.get("/", protect, getComplaint);

// Create complaint with an optional attachment
complaintRouter.post(
"/",
protect,
upload.single("attachment"),
createComplaint
);

// Update complaint with an optional new attachment
complaintRouter.put(
"/:id",
protect,
upload.single("attachment"),
updateComplaint
);

export default complaintRouter;