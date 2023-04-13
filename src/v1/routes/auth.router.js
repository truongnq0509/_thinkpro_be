import express from "express";
import { signin, signup, me, logout, refresh, send, resetPassword } from "../controllers/auth.controller";
const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/refresh-token", refresh);
router.get("/", me)
router.delete('/', logout)
router.post('/send-email', send)
router.post("/reset-password", resetPassword)
export default router;
