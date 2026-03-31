import { productModel } from "../models/product.model.js"; 

export default class Products {
    get = async() => await productModel.find();
    getById = async(id) => await productModel.findById(id);
    create = async(data) => await productModel.create(data);
    update = async(id, data) => await productModel.findByIdAndUpdate(id, data, { new: true });
    delete = async(id) => await productModel.findByIdAndDelete(id);
}