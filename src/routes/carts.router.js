import { Router } from "express";
import { purchaseCart } from "../controllers/carts.controller.js";
import passport from "passport";
import { authorization } from "../middlewares/auth.middleware.js";
import { cartService } from "../repositories/index.js"; 

const router = Router();

router.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartService.getCartById(cid);
        if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        
        res.json({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

router.post("/:cid/products/:pid", 
    passport.authenticate('jwt', { session: false }), 
    authorization('user'), 
    async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const cart = await cartService.getCartById(cid);
            
            if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

            const productIndex = cart.products.findIndex(p => p.product._id.toString() === pid || p.product.toString() === pid);
            
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ product: pid, quantity: 1 });
            }

            await cartService.updateCart(cid, cart);
            res.json({ status: "success", message: "Producto agregado al carrito" });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    }
);

router.delete("/:cid/products/:pid", 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const cart = await cartService.getCartById(cid);
            if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

            cart.products = cart.products.filter(p => p.product._id.toString() !== pid && p.product.toString() !== pid);

            await cartService.updateCart(cid, cart);
            res.json({ status: "success", message: "Producto eliminado del carrito" });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
});

router.delete("/:cid", 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        try {
            const { cid } = req.params;
            const cart = await cartService.getCartById(cid);
            if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

            cart.products = []; 

            await cartService.updateCart(cid, cart);
            res.json({ status: "success", message: "Carrito vaciado correctamente" });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
});

router.post("/:cid/purchase", 
    passport.authenticate('jwt', { session: false }), 
    authorization('user'), 
    purchaseCart
);

export default router;