import { cartService, productService, ticketService } from "../repositories/index.js";
import { v4 as uuidv4 } from 'uuid';

export const purchaseCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartService.getCartById(cid);
        
        if (!cart) return res.status(404).send({ status: "error", message: "Carrito no encontrado" });

        const productsWithStock = [];
        const productsWithoutStock = [];
        let totalAmount = 0;

        for (const item of cart.products) {
            const product = item.product;
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await productService.updateProduct(product._id, product);
                totalAmount += product.price * item.quantity;
                productsWithStock.push(item);
            } else {
                productsWithoutStock.push(item);
            }
        }

        if (productsWithStock.length === 0) {
            return res.status(400).send({ status: "error", message: "No hay stock suficiente para procesar la compra" });
        }

        const ticketData = {
            code: uuidv4(),
            purchase_datetime: new Date(),
            amount: totalAmount,
            purchaser: req.user.email
        };

        const ticket = await ticketService.createTicket(ticketData);

        cart.products = productsWithoutStock;
        await cartService.updateCart(cid, cart);

        res.send({ status: "success", payload: ticket });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", message: "Error interno al procesar el pago" });
    }
};