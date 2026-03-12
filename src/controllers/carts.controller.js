import Cart from "../dao/models/cart.model.js";
import { productModel } from "../dao/models/product.model.js";
import { ticketModel } from "../dao/models/ticket.model.js";
import { v4 as uuidv4 } from "uuid";

export const purchaseCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid).populate("products.product");

        if (!cart) return res.status(404).send({ status: "error", message: "Carrito no encontrado" });

        const outOfStock = [];
        let totalAmount = 0;

        for (const item of cart.products) {
            const product = item.product;
            const quantity = item.quantity;

            if (product.stock >= quantity) {

                product.stock -= quantity;
                await product.save();
                totalAmount += product.price * quantity;
            } else {
                
                outOfStock.push(item.product._id);
            }
        }

        if (totalAmount > 0) {
            await ticketModel.create({
                code: uuidv4(),
                amount: totalAmount,
                purchaser: req.user.email
            });
        }

        cart.products = cart.products.filter(item => 
            outOfStock.some(id => id.equals(item.product._id))
        );
        await cart.save();

        res.send({
            status: "success",
            message: totalAmount > 0 ? "Compra procesada" : "No se pudo procesar ningún producto por falta de stock",
            outOfStock
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", message: "Error interno al procesar la compra" });
    }
};