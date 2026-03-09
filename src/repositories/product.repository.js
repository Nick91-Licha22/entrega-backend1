export default class ProductRepository {
    constructor(dao) { this.dao = dao; }
    async getProductById(id) { return await this.dao.getById(id); }
    async updateProduct(id, data) { return await this.dao.update(id, data); }
}