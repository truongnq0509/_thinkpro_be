import express from "express";
import { get, create, remove, update } from "../controllers/option.controller";
import { verifyAccessToken } from "../middlewares/init-jwt.middleware"
import { checkPermission } from "../middlewares/check-permission.middleware"

const router = express.Router()

// public router
router.get('/:id', get)

// private router
router.use([verifyAccessToken, checkPermission])
router.post('/', create)
router.put('/:id', update)
router.delete('/:id', remove)

export default router