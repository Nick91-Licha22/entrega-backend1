import Cart from "./models/cart.model.js";

export default class CartDAO {
    async getById(id) { return await Cart.findById(id).populate('products.product'); }
    async update(id, data) { return await Cart.findByIdAndUpdate(id, data, { new: true }); }
}