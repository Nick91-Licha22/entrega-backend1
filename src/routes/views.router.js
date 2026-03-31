import { Router } from 'express';
import { productService, cartService } from '../repositories/index.js';

const router = Router();

router.get('/products', async (req, res) => {
    try {
        const products = await productService.getProducts();
        
        const cartId = req.user ? req.user.cart : null;

        res.render('products', { 
            products, 
            user: req.user, 
            cartId: cartId 
        });
    } catch (error) {
        console.error("Error en vista productos:", error);
        res.render('error', { error: "No se pudieron cargar los productos" });
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartService.getCartById(cid);
        res.render('cart', { cart });
    } catch (error) {
        res.render('error', { error: "No se pudo cargar el carrito" });
    }
});

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

export default router;