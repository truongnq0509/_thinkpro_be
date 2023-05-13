import express from "express";
import { getMultipleFile, removeFile, uploadFile, getSingleFile } from "../controllers/upload.controller";
import fileUploader from "../config/cloudinary.config";
import { checkPermission } from "../middlewares/check-permission.middleware";
import { verifyAccessToken } from "../middlewares/init-jwt.middleware";

const router = express.Router();

//prive router
// router.use([verifyAccessToken, checkRole]);
router.delete("/", removeFile);
router.post("/single", fileUploader.single('thumbnail'), getSingleFile)
router.post("/multiple", fileUploader.fields([{ name: "assets", maxCount: 10 }, { name: "images", maxCount: 10 }]), getMultipleFile);
router.put("/:filename", uploadFile);

export default router;
