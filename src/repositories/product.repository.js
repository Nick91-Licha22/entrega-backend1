export default class ProductRepository {
    constructor(dao) { this.dao = dao; }
    async getProducts(filter, options) { return await this.dao.getAll(filter, options); }
    async getProductById(id) { return await this.dao.getById(id); }
    async createProduct(data) { return await this.dao.create(data); }
    async updateProduct(id, data) { return await this.dao.update(id, data); }
    async deleteProduct(id) { return await this.dao.delete(id); }
}