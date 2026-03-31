import { Router } from 'express';
import { productService, cartService } from '../repositories/index.js';

const router = Router();

router.get('/products', async (req, res) => {
    try {
        const products = await productService.getProducts();
        const cartId = req.user ? (req.user.cart._id || req.user.cart) : null;

        res.render('products', { 
            products, 
            user: req.user, 
            cartId: cartId 
        });
    } catch (error) {
        res.status(500).render('error', { error: error.message });
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartService.getCartById(cid);
        
        const total = cart.products.reduce((acc, item) => {
            return acc + (item.quantity * item.product.price);
        }, 0);

        res.render('cart', { 
            products: cart.products, 
            cartId: cid,
            total: total
        });
    } catch (error) {
        res.status(500).render('error', { error: "No se pudo cargar el carrito" });
    }
});

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

export default router;