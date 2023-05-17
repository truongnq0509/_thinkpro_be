import express from "express";
import { signin, signup, me, logout, refresh, send, resetPassword, verifyRegisterEmail, updateUser, changePassword } from "../controllers/auth.controller";
import { verifyAccessToken } from "../middlewares/init-jwt.middleware";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/verify-email/:token", verifyRegisterEmail)
router.get("/refresh-token", refresh);
router.get("/me", verifyAccessToken, me)
router.put("/change-password", verifyAccessToken, changePassword)
router.put('/', verifyAccessToken, updateUser)
router.delete('/', logout)
router.post('/send-email', send)
router.post("/reset-password", resetPassword)
export default router;
