import { Router } from "express";
import ProductManager from "../productManager.js";
import { join } from "path";

const viewsRouter = Router();
viewsRouter.get("/", async (req, res) => {
    const productManager = req.app.get('productManager');
    try {
        const products = await productManager.getProducts();
        res.render("home", { products });
    } catch (error) {
        console.error("Error al cargar productos en /:", error);
        res.render("home", { products: [], error: "No se pudieron cargar los productos iniciales." });
    }
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
    const productManager = req.app.get('productManager');

    try {
        const products = await productManager.getProducts();
        res.render("realTimeProducts", { products });
    } catch (error) {
        console.error("Error al cargar productos en /realtimeproducts:", error);
        res.render("realTimeProducts", { products: [], error: "No se pudieron cargar los productos iniciales." });
    }
});

export default viewsRouter;