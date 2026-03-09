import { cartService, productService, ticketService } from "../repositories/index.js";
import { v4 as uuidv4 } from 'uuid';

export const purchaseCart = async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartService.getCartById(cid);
        if (!cart) return res.status(404).send({ error: "Carrito no encontrado" });

        let totalAmount = 0;
        const outOfStock = [];

        for (const item of cart.products) {
            if (item.product.stock >= item.quantity) {
                item.product.stock -= item.quantity;
                await productService.updateProduct(item.product._id, { stock: item.product.stock });
                totalAmount += item.product.price * item.quantity;
            } else {
                outOfStock.push(item.product._id);
            }
        }

        if (totalAmount > 0) {
            await ticketService.createTicket({
                code: uuidv4(),
                amount: totalAmount,
                purchaser: req.user.user.email
            });
        }

        const updatedProducts = cart.products.filter(item => outOfStock.includes(item.product._id));
        await cartService.updateCart(cid, { products: updatedProducts });

        res.send({ status: "success", message: "Compra procesada", outOfStock });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};