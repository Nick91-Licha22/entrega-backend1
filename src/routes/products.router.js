import { Router } from "express";

const router = Router();
router.get("/", async (req, res) => {
  const productManager = req.app.get('productManager');
  try {
    const { limit } = req.query;
    const products = await productManager.getProducts();

    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  const productManager = req.app.get('productManager');
  try {
    const product = await productManager.getProductById(req.params.pid);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const io = req.app.get('socketio');
  const productManager = req.app.get('productManager');

  try {
    const newProduct = await productManager.addProduct(req.body);

    io.emit('productAdded', newProduct);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  const productManager = req.app.get('productManager');
  try {
    const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
    res.json(updatedProduct);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  const productId = req.params.pid;
  const io = req.app.get('socketio');
  const productManager = req.app.get('productManager');

  try {
    await productManager.deleteProduct(productId);

    io.emit('productDeleted', productId);

    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;