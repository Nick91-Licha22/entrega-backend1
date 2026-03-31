import { productService } from "../repositories/index.js";

export const getProducts = async (req, res) => {
    try {
        const products = await productService.getProducts();
        res.send({ status: "success", payload: products });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const product = req.body;
        const result = await productService.createProduct(product);
        res.send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const result = await productService.updateProduct(pid, req.body);
        res.send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const result = await productService.deleteProduct(pid);
        res.send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
};