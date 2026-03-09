import { Router } from "express";
import { productModel } from "../dao/models/product.dao.js";
import Cart from "../dao/models/cart.model.js";

const router = Router();
router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 8, category } = req.query;
        let filter = {};
        if (category) {
            filter.category = category; 
        }

        const { docs, ...pagination } = await productModel.paginate(filter, { page, limit, lean: true });
        const prevLink = pagination.hasPrevPage ? `/products?page=${pagination.prevPage}${category ? `&category=${category}` : ''}` : null;
        const nextLink = pagination.hasNextPage ? `/products?page=${pagination.nextPage}${category ? `&category=${category}` : ''}` : null;

        res.render("home", { 
            products: docs, 
            pagination, 
            category,
            prevLink,
            nextLink
        });
    } catch (error) {
        res.status(500).send("Error al cargar productos");
    }
});
router.get("/products/:pid", async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).lean();
        if (!product) return res.status(404).send("Producto no encontrado");
        res.render("productDetail", { product });
    } catch (error) {
        res.status(400).send("ID no válido");
    }
});

router.get("/carts/:cid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate("products.product").lean();
        if (!cart) return res.status(404).send("Carrito no encontrado");
        
        res.render("cart", { 
            cartId: cart._id, 
            products: cart.products 
        });
    } catch (error) {
        res.status(500).send("Error al cargar el carrito");
    }
});

router.get("/realtimeproducts", async (req, res) => {
    const products = await productModel.find().lean();
    res.render("realTimeProducts", { products });
});


export default router;