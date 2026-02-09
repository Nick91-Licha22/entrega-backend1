import { Router } from "express";
import { productModel } from "../dao/models/product.model.js";

const router = Router();
router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const filter = query 
            ? { $or: [{ category: query }, { status: query === "true" }] } 
            : {};

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
            lean: true
        };

        const result = await productModel.paginate(filter, options);

        res.json({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid);
        if (!product) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        res.json({ status: "success", payload: product });
    } catch (error) {
        res.status(400).json({ status: "error", message: "ID no válido" });
    }
});

router.post("/", async (req, res) => {
    try {
        const productData = req.body;
        let result;
        if (Array.isArray(productData)) {
            result = await productModel.insertMany(productData);
        } else {
            result = await productModel.create(productData);
        }

        const io = req.app.get('socketio');
        io.emit('productAdded', result);

        res.status(201).json({ status: "success", payload: result });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const updatedProduct = await productModel.findByIdAndUpdate(
            req.params.pid, 
            req.body, 
            { new: true } 
        );
        if (!updatedProduct) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        res.json({ status: "success", payload: updatedProduct });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const productId = req.params.pid;
        const deletedProduct = await productModel.findByIdAndDelete(productId);
        
        if (!deletedProduct) return res.status(404).json({ status: "error", message: "Producto no encontrado" });

        const io = req.app.get('socketio');
        io.emit('productDeleted', productId);

        res.json({ status: "success", message: "Producto eliminado exitosamente" });
    } catch (error) {
        res.status(400).json({ status: "error", message: "ID no válido" });
    }
});


export default router;