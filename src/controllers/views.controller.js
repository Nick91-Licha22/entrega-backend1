import { productService, cartService } from '../repositories/index.js';

export const renderProducts = async (req, res) => {
    try {
        const result = await productService.getProducts(req.query);
        const productsData = result.docs ? result.docs : result;

        const products = productsData.map(d => {
            const doc = d.toObject ? d.toObject() : d;
        
            let rawImg = (doc.thumbnails && doc.thumbnails.length > 0) 
                ? doc.thumbnails[0] 
                : (doc.thumbnail || 'default.jpg');

            doc.displayImage = (rawImg.startsWith('http') || rawImg.startsWith('/img/')) 
                ? rawImg 
                : `/img/${rawImg}`;

            return doc;
        });

        res.render('products', { 
            products, 
            user: req.user, 
            cartId: req.user ? (req.user.cart._id || req.user.cart) : null, 
            style: 'index.css' 
        });
    } catch (error) {
        console.error(error);
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

        res.render('cart', { products, cartId: cid, user: req.user });
    } catch (error) {
        res.render('error', { error: 'Error al cargar el carrito' });
    }
};