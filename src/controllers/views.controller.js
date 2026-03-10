import { productService, cartService } from "../repositories/index.js";

export const renderProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort, query } = req.query;
        const products = await productService.getProducts(page, limit, sort, query);
        
        const userCartId = req.user?.cart || "696556c1969868926e6ddd6e"; 

        res.render("products", { 
            products: products.docs,
            pagination: products,
            cartId: userCartId, 
            user: req.user 
        });
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
};

export const renderProductDetail = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.pid);
        const userCartId = req.user?.cart || "696556c1969868926e6ddd6e";

        res.render("productDetail", { 
            product, 
            cartId: userCartId 
        });
    } catch (error) {
        res.status(404).render("error", { error: "Producto no encontrado" });
    }
};