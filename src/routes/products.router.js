import { Router } from "express";
import { productModel } from "../dao/models/product.model.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        let filter = query ? { category: query } : {};
        let options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
            lean: true
        };

        const products = await productModel.paginate(filter, options);
        res.send({ status: "success", payload: products });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});


router.get("/:pid", async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).lean();
        if (!product) return res.status(404).send({ error: "Producto no encontrado" });
        res.send({ status: "success", payload: product });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

export default router;