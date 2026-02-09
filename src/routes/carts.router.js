import express from "express";
import Cart from "../dao/models/cart.model.js";

const cartsRouter = express.Router();
cartsRouter.post("/", async (req, res) => {
    try {
        const cart = await Cart.create({ products: [] });
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }
        await cart.save();
        res.json({ status: "success", message: "Producto sumado" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex !== -1) {
            if (cart.products[productIndex].quantity > 1) {
                cart.products[productIndex].quantity -= 1;
            } else {
                cart.products.splice(productIndex, 1);
            }
            await cart.save();
            res.send({ status: "success", message: "Producto restado" });
        } else {
            res.status(404).send({ status: "error", message: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

cartsRouter.delete("/:cid/products/:pid/all", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();
        res.json({ status: "success", message: "Producto quitado totalmente" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

cartsRouter.delete("/:cid", async (req, res) => {
    await Cart.findByIdAndUpdate(req.params.cid, { products: [] });
    res.json({ status: "success", message: "Carrito vaciado" });
});

cartsRouter.get("/:cid", async (req, res) => {
    const cart = await Cart.findById(req.params.cid).populate("products.product").lean();
    res.json({ status: "success", payload: cart });
});

export default cartsRouter;