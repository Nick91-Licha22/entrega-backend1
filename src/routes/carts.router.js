import { Router } from 'express';
import { cartModel } from '../dao/models/cart.model.js';
import { productModel } from '../dao/models/product.model.js';
import { ticketModel } from '../dao/models/ticket.model.js'; 
import { v4 as uuidv4 } from 'uuid';
import { passportCall } from '../utils.js';

const router = Router();

router.post('/:cid/product/:pid', passportCall('jwt'), async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartModel.findById(cid);
        if (!cart) return res.status(404).send({ error: "Carrito no encontrado" });

        const item = cart.products.find(p => p.product.toString() === pid);
        if (item) {
            item.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }
        await cart.save();
        res.send({ status: "success", message: "Producto agregado" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/:cid/purchase', passportCall('jwt'), async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findById(cid).populate('products.product');
        
        let totalAmount = 0;
        const leftOver = [];

        for (const item of cart.products) {
            if (item.product.stock >= item.quantity) {
                item.product.stock -= item.quantity;
                await item.product.save();
                totalAmount += item.product.price * item.quantity;
            } else {
                leftOver.push(item);
            }
        }

        if (totalAmount > 0) {
            const ticket = await ticketModel.create({
                code: uuidv4(),
                amount: totalAmount,
                purchaser: req.user.email
            });
            cart.products = leftOver;
            await cart.save();
            return res.send({ status: "success", payload: ticket });
        }
        
        res.status(400).send({ error: "No hay stock para completar ninguna compra" });
    } catch (error) {
        res.status(500).send({ error: "Error en el proceso de compra" });
    }
});

export default router;