import { Router } from 'express';
import { productService, cartService } from '../repositories/index.js';

const router = Router();

router.get('/products', async (req, res) => {
    try {
        const { category } = req.query;
        let products = await productService.getProducts();

        if (category) {
            products = products.filter(p => p.category === category);
        }

        const cartId = req.user ? (req.user.cart._id || req.user.cart) : null;

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

router.get('/product/:pid', async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.pid);
        const cartId = req.user ? (req.user.cart._id || req.user.cart) : null;
        res.render('productDetail', { product, user: req.user, cartId });
    } catch (error) {
        res.render('error', { error: "Producto no encontrado" });
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartService.getCartById(cid);
        if (!cart || cart.products.length === 0) return res.render('cartEmpty');
        res.render('cart', { cart, cartId: cid });
    } catch (error) {
        res.render('error', { error: "No se pudo cargar el carrito" });
    }
});

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

export default router;