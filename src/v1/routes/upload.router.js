import express from "express";
import { getSingleFile, getMultipleFile, removeFile, uploadFile } from "../controllers/upload.controller";
import fileUploader from "../config/cloudinary.config";
import { checkRole } from "../middlewares/check_permission.middleware";
import { verifyAccessToken } from "../middlewares/init_jwt.middleware";

const router = express.Router();

//prive router
router.use([verifyAccessToken, checkRole]);
router.delete("/", removeFile);
router.post("/single", fileUploader.single("thumbnail"), getSingleFile);
router.post("/multiple", fileUploader.array("assets", 10), getMultipleFile);
router.put("/:filename", uploadFile);

export default router;
