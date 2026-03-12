import { Router } from "express";
import { productModel } from "../dao/models/product.model.js";
import { passportCall } from "../utils.js";
import { authorization } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", async (req, res) => {
    const products = await productModel.find().lean();
    res.send({ status: "success", payload: products });
});

router.post("/", passportCall('jwt'), authorization('admin'), async (req, res) => {
    const newProduct = req.body;
    const result = await productModel.create(newProduct);
    res.send({ status: "success", payload: result });
});

router.delete("/:pid", passportCall('jwt'), authorization('admin'), async (req, res) => {
    const { pid } = req.params;
    await productModel.findByIdAndDelete(pid);
    res.send({ status: "success", message: "Producto eliminado" });
});

export default router;