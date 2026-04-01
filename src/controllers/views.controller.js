import { productService, cartService } from '../repositories/index.js';

export const renderProducts = async (req, res) => {
    try {
        const result = await productService.getProducts(req.query);
        
        // Normalizamos los productos para que Handlebars no los bloquee
        const products = (result && result.docs) 
            ? result.docs.map(d => d.toObject()) 
            : (Array.isArray(result) ? result.map(d => d.toObject()) : []);

        res.render('products', { 
            products, 
            user: req.user, 
            cartId: req.user ? req.user.cart : null, // ID del carrito para el botón superior
            style: 'index.css' 
        });
    } catch (error) {
        console.error("Error en renderProducts:", error);
        res.render('error', { error: 'No se pudieron cargar los productos' });
    }
};

export const renderCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartService.getCartById(cid);
        
        if (!cart) return res.render('error', { error: 'Carrito no encontrado' });

        const products = cart.products.map(item => ({
            product: item.product.toObject ? item.product.toObject() : item.product,
            quantity: item.quantity
        }));

        res.render('cart', { 
            products, 
            cartId: cid,
            user: req.user 
        });
    } catch (error) {
        console.error("Error en renderCart:", error);
        res.render('error', { error: 'Error al cargar la vista del carrito' });
    }
};