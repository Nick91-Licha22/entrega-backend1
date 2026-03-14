import { cartModel } from "./models/cart.model.js";

export default class CartDAO {
    async getById(id) { 
        
        return await cartModel.findById(id); 
    }
    async update(id, data) { 
        return await cartModel.findByIdAndUpdate(id, data, { new: true }); 
    }
}