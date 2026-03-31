import cartModel from "../../models/cart.model.js";

export default class Carts {
    get = async() => {
        return await cartModel.find().populate('products.product');
    }

    getById = async(id) => {
        return await cartModel.findById(id).populate('products.product');
    }

    create = async() => {
        return await cartModel.create({ products: [] });
    }

    update = async(id, data) => {
        return await cartModel.findByIdAndUpdate(id, data, { new: true });
    }
}