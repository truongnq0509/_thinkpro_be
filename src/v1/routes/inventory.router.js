import express from "express"
import { createAndUpdate, get } from "../controllers/inventory.controller"
import { verifyAccessToken } from "../middlewares/init-jwt.middleware"
import { checkPermission } from "../middlewares/check-permission.middleware"
const router = express.Router()

// public router
router.get('/:id', get)

// private router
router.use([verifyAccessToken, checkPermission])
router.post('/', createAndUpdate)
router.put('/', createAndUpdate)

export default router