import express from "express";
import { get, create, update, remove, restore, store } from "../controllers/product.controller";
import { checkRole } from "../middlewares/check_permission.middleware";
import { verifyAccessToken } from "../middlewares/init_jwt.middleware";

const router = express.Router();

// public router
router.get("/", get);

//prive router
router.use([verifyAccessToken, checkRole]);
router.get("/store", store);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);
router.patch("/:id", restore);

export default router;
