import { ticketModel } from "../dao/models/ticket.model.js";
import { productModel } from "../dao/models/product.model.js";
import Cart from "../dao/models/cart.model.js";
import { v4 as uuidv4 } from "uuid";

export const purchaseCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid).populate("products.product");
        if (!cart) return res.status(404).send("Carrito no encontrado");

        let totalAmount = 0;
        const unavailableProducts = [];

        for (const item of cart.products) {
            const product = item.product;
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();
                totalAmount += product.price * item.quantity;
            } else {
                unavailableProducts.push(item.product._id);
            }
        }

        if (totalAmount > 0) {
            const ticket = await ticketModel.create({
                code: uuidv4(),
                amount: totalAmount,
                purchaser: req.user.email
            });
            cart.products = cart.products.filter(item => 
                unavailableProducts.includes(item.product._id)
            );
            await cart.save();

            return res.send({ status: "success", message: "Compra finalizada", ticket, unavailableProducts });
        } else {
            return res.status(400).send({ status: "error", message: "No hay stock suficiente de ningún producto seleccionado." });
        }

    } catch (error) {
        res.status(500).send("Error en el proceso de compra");
    }
};