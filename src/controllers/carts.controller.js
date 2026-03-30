import { cartService, productService, ticketService } from "../repositories/index.js";
import { v4 as uuidv4 } from 'uuid';

export const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartService.getCartById(cid);
        if (!cart) return res.status(404).send({ error: "Carrito no encontrado" });

        const item = cart.products.find(p => p.product._id.toString() === pid);
        if (item) {
            item.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }
        
        await cartService.updateCart(cid, cart);
        res.send({ status: "success", message: "Producto agregado" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

export const purchaseCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartService.getCartById(cid);
        if (!cart) return res.status(404).send({ status: "error", message: "Carrito no encontrado" });

        let totalAmount = 0;
        const leftOver = [];

        for (const item of cart.products) {
            
            if (item.product.stock >= item.quantity) {
                item.product.stock -= item.quantity;
                await productService.updateProduct(item.product._id, item.product);
                totalAmount += (item.product.price * item.quantity);
            } else {
                leftOver.push(item);
            }
        }

        if (totalAmount > 0) {
            const ticket = await ticketService.createTicket({
                code: uuidv4(),
                amount: totalAmount,
                purchaser: req.user.email 
            });
            
            cart.products = leftOver;
            await cartService.updateCart(cid, cart);
            
            return res.send({ status: "success", payload: ticket });
        }
        
        res.status(400).send({ error: "No se pudo realizar la compra. Verifique el stock de los productos." });
    } catch (error) {
        res.status(500).send({ error: "Error en el proceso de compra" });
    }
};