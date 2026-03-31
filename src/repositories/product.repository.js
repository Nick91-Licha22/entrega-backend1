export default class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getProducts = async () => {
        return await this.dao.get(); 
    }

    getProductById = async (id) => {
        return await this.dao.getById(id);
    }

    createProduct = async (product) => {
        return await this.dao.create(product);
    }

    updateProduct = async (id, product) => {
        return await this.dao.update(id, product);
    }

    deleteProduct = async (id) => {
        return await this.dao.delete(id);
    }
}