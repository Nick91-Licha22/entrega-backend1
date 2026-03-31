import productModel from "../../models/product.model.js";

export default class Products {
    get = async() => {
        return await productModel.find();
    }
    getById = async(id) => {
        return await productModel.findById(id);
    }

    // Crear un producto nuevo
    create = async(data) => {
        return await productModel.create(data);
    }

    // Actualizar (Stock, precio, etc.)
    update = async(id, data) => {
        return await productModel.findByIdAndUpdate(id, data, { new: true });
    }

    // Eliminar
    delete = async(id) => {
        return await productModel.findByIdAndDelete(id);
    }
}