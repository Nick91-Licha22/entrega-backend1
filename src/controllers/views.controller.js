import { productService, cartService } from '../repositories/index.js';

export const renderProducts = async (req, res) => {
    try {
        // Usamos el Repository (productService es una instancia de ProductRepository)
        const result = await productService.getProducts(req.query);
        
        // El Repository ya debería devolvernos los datos limpios o usamos toObject
        const products = result.docs 
            ? result.docs.map(d => d.toObject()) 
            : result.map(d => d.toObject());

        res.render('products', { 
            products, 
            user: req.user, 
            style: 'index.css' 
        });
    } catch (error) {
        res.render('error', { error: 'Error al cargar productos' });
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
        res.render('error', { error: 'Error al cargar el carrito' });
    }
};