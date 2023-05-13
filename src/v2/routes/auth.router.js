import express from "express";
import { signin, signup, me, logout, refresh, send, resetPassword, verifyRegisterEmail } from "../controllers/auth.controller";
import { verifyAccessToken } from "../middlewares/init-jwt.middleware";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/verify-email/:token", verifyRegisterEmail)
router.get("/refresh-token", refresh);
router.get("/me", verifyAccessToken, me)
router.delete('/', logout)
router.post('/send-email', send)
router.post("/reset-password", resetPassword)
export default router;
