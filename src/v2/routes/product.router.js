import express from "express";
import { get, create, update, remove, restore, store, search, createProductVariant, updateProductVariant, removeProductVariant } from "../controllers/product.controller";
import { checkPermission } from "../middlewares/check-permission.middleware";
import { verifyAccessToken } from "../middlewares/init-jwt.middleware";

const router = express.Router();

// public router
router.get("/", get);
router.get("/search", search)

//prive router
router.use([verifyAccessToken, checkPermission]);
router.get("/store", store);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);
router.patch("/:id", restore);
router.post('/variant', createProductVariant)
router.put('/variant/:id', updateProductVariant)
router.delete('/variant/:id', removeProductVariant)

export default router;
