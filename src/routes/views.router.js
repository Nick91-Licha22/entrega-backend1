import { Router } from 'express';
import { productModel } from '../dao/models/product.model.js';
import { cartModel } from '../dao/models/cart.model.js';
import { passportCall } from '../utils.js';

const router = Router();

router.get('/products', passportCall('jwt'), async (req, res) => {
    try {
        const { page = 1, category } = req.query;
        const filter = category ? { category } : {};
        const products = await productModel.paginate(filter, { page, limit: 8, lean: true });
        
        res.render('products', {
            products: products.docs,
            pagination: products,
            user: req.user,
            cartId: req.user ? req.user.cart : null 
        });
    } catch (error) {
        res.status(500).render('error', { error: "Error al cargar productos" });
    }
});

router.get('/carts/:cid', passportCall('jwt'), async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findById(cid).populate('products.product').lean();

        if (!cart) return res.status(404).render('error', { message: 'Carrito no encontrado' });

        const total = cart.products.reduce((acc, item) => {
            return acc + (item.product ? item.product.price * item.quantity : 0);
        }, 0);

        res.render('cart', {
            cartId: cid,
            products: cart.products,
            total: total.toFixed(2),
            user: req.user
        });
    } catch (error) {
        res.status(500).render('error', { error: 'Error al cargar el carrito' });
    }
});

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

export default router;