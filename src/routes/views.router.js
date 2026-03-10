import { Router } from "express";
import jwt from "jsonwebtoken";
import { productModel } from "../dao/models/product.model.js";
import Cart from "../dao/models/cart.model.js";
import { PRIVATE_KEY } from "../utils.js"; 

const router = Router();

const checkAuth = (req, res, next) => {
    const token = req.cookies.coderCookie || req.cookies.jwt; 
    if (token) {
        jwt.verify(token, PRIVATE_KEY, (err, decoded) => {
            if (!err) req.user = decoded.user;
        });
    }
    next();
};

router.use(checkAuth);

router.get("/forgot-password", (req, res) => {
    res.render("forgotPassword");
});

router.get("/reset-password", (req, res) => {
    res.render("resetPassword");
});

router.get("/login", (req, res) => {
    res.render("login"); 
});

router.get("/register", (req, res) => {
    res.render("register"); 
});

router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 8, category } = req.query;
        let filter = {};
        if (category) filter.category = category; 

        const { docs, ...pagination } = await productModel.paginate(filter, { page, limit, lean: true });
        
        const cartId = req.user?.cart || null;

        res.render("home", { 
            products: docs, 
            pagination, 
            category,
            user: req.user,
            cartId 
        });
    } catch (error) {
        res.status(500).send("Error al cargar productos");
    }
});

router.get("/products/:pid", async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).lean();
        if (!product) return res.status(404).send("Producto no encontrado");
        
        const cartId = req.user?.cart || null;

        res.render("productDetail", { product, cartId, user: req.user });
    } catch (error) {
        res.status(400).send("ID no válido");
    }
});

router.get("/carts/:cid", async (req, res) => {
    try {
        if (!req.params.cid || req.params.cid === "undefined") {
            return res.render("cart", { products: [] }); 
        }

        const cart = await Cart.findById(req.params.cid).populate("products.product").lean();
        
        if (!cart) return res.render("cart", { products: [] });
        
        res.render("cart", { cartId: cart._id, products: cart.products });
    } catch (error) {
        console.error("Error al cargar carrito:", error);
        res.render("cart", { products: [] });
    }
});

router.get("/realtimeproducts", async (req, res) => {
    const products = await productModel.find().lean();
    res.render("realTimeProducts", { products });
});

export default router;