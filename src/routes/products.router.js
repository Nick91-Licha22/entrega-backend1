import { Router } from "express";
import * as productsController from "../controllers/product.controller.js";
import { passportCall, authorization } from "../utils.js"; 

const router = Router();

router.get("/", productsController.getProducts);
router.post("/", passportCall('jwt'), authorization(['admin']), productsController.createProduct);
router.delete("/:pid", passportCall('jwt'), authorization(['admin']), productsController.deleteProduct);

export default router;