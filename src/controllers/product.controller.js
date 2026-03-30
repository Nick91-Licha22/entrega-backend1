import { productService } from "../repositories/index.js";

export const getProducts = async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        const filter = query ? { $or: [{ category: query }, { status: query === "true" }] } : {};
        const options = { limit: parseInt(limit), page: parseInt(page), lean: true, sort: sort ? { price: sort === "asc" ? 1 : -1 } : {} };
        
        const result = await productService.getProducts(filter, options);
        res.send({ status: "success", payload: result });
    } catch (error) { res.status(500).send({ status: "error", message: error.message }); }
};

export const createProduct = async (req, res) => {
    try {
        const result = await productService.createProduct(req.body);
        const io = req.app.get('socketio');
        io.emit('productAdded', result);
        res.status(201).send({ status: "success", payload: result });
    } catch (error) { res.status(500).send({ status: "error", message: error.message }); }
};

export const deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.pid);
        const io = req.app.get('socketio');
        io.emit('productDeleted', req.params.pid);
        res.send({ status: "success", message: "Producto eliminado" });
    } catch (error) { res.status(500).send({ status: "error", message: error.message }); }
};