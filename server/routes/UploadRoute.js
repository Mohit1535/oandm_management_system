import { Router } from "express";

const imageRouter=Router;

imageRouter.post("/upload",
  upload.array("image"),
  uploadImage
);

export default imageRouter