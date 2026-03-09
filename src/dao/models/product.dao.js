import { productModel } from "./models/product.model.js";

export default class ProductDAO {
    async get() { return await productModel.find(); }
    async getById(id) { return await productModel.findById(id); }
    async update(id, data) { return await productModel.findByIdAndUpdate(id, data, { new: true }); }
}