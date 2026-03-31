import cartModel from "../../models/cart.model.js";

export default class Carts {
    get = async() => await cartModel.find().populate('products.product');
    getById = async(id) => await cartModel.findById(id).populate('products.product');
    create = async() => await cartModel.create({ products: [] });
    update = async(id, data) => await cartModel.findByIdAndUpdate(id, data, { new: true });
}