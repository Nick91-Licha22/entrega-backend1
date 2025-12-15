import fs from "fs/promises";
import crypto from "crypto";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(product) {
    try {
      const products = await this.getProducts();

      if (!product.title || !product.description || !product.price || !product.code || !product.stock || !product.category) {
        throw new Error("Todos los campos son obligatorios");
      }

      const newProduct = {
        id: crypto.randomUUID(),
        status: true,
        thumbnails: "",
        ...product
      };

      products.push(newProduct);
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
      return newProduct;
    } catch (error) {
      throw new Error("Error al agregar producto: " + error.message);
    }
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const product = products.find((p) => p.id == id);
      if (!product) throw new Error("Producto no encontrado");
      return product;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(id, updates) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((p) => p.id == id);

      if (index === -1) throw new Error("Producto no encontrado");

      const updatedProduct = { ...products[index], ...updates, id: products[index].id };
      products[index] = updatedProduct;

      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const initialLength = products.length;
      const filteredProducts = products.filter((p) => p.id != id);

      if (initialLength === filteredProducts.length) {
        throw new Error("Producto no encontrado para eliminar");
      }

      await fs.writeFile(this.path, JSON.stringify(filteredProducts, null, 2));

      return id;

    } catch (error) {
      throw error;
    }
  }
}

export default ProductManager;