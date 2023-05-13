import express from "express"
import { createAndUpdate } from "../controllers/inventory.controller"
import { verifyAccessToken } from "../middlewares/init-jwt.middleware"
import { checkPermission } from "../middlewares/check-permission.middleware"
const router = express.Router()

router.use([verifyAccessToken, checkPermission])
router.post('/', createAndUpdate)
router.put('/', createAndUpdate)

export default router