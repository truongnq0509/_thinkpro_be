import express from "express"
import { payMomo, get, getOrderByUser, cancelOrder, create, orderStatus } from "../controllers/order.controller"
import { verifyAccessToken } from "../middlewares/init-jwt.middleware"
import { checkPermission } from "../middlewares/check-permission.middleware"


const router = express.Router()

router.use(verifyAccessToken)
router.get("/me", getOrderByUser)
router.post('/', create)
router.get("/:id", checkPermission, get)
router.get("/", checkPermission, get)
router.post("/pay-momo", payMomo)
router.delete("/:id", cancelOrder)
router.patch("/:id", checkPermission, orderStatus)

export default router