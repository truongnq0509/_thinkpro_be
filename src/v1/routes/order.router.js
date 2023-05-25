import express from "express"
import { payMomo, payVnPay, get, getOrderByUser, cancelOrder, create, orderStatus, updateOrder } from "../controllers/order.controller"
import { verifyAccessToken } from "../middlewares/init-jwt.middleware"
import { checkPermission } from "../middlewares/check-permission.middleware"


const router = express.Router()

router.use(verifyAccessToken)
router.get("/me", getOrderByUser)
router.post('/', create)
router.get("/:id", get)
router.get("/", checkPermission, get)
router.post("/pay-momo", payMomo)
router.post("/pay-vnpay", payVnPay)
router.put("/:id", updateOrder)
router.delete("/:id", cancelOrder)
router.patch("/:id", checkPermission, orderStatus)

export default router