import express from "express"
import { get, removeCart, removeProduct, addToCart } from "../controllers/cart.controller"
import { verifyAccessToken } from "../middlewares/init-jwt.middleware"

const router = express.Router()

router.use(verifyAccessToken)
router.get("/", get)
router.put("/", addToCart)
router.delete("/", removeCart)
router.delete("/:productId", removeProduct)

export default router