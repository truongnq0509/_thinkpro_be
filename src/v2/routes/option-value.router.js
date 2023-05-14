import express from "express";
import { create, remove, update } from "../controllers/option-value.controller";
import { verifyAccessToken } from "../middlewares/init-jwt.middleware"
import { checkPermission } from "../middlewares/check-permission.middleware"

const router = express.Router()

// private router
router.use([verifyAccessToken, checkPermission])
router.post('/', create)
router.put('/:id', update)
router.delete('/:id', remove)

export default router