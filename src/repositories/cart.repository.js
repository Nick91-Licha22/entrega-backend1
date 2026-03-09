export default class CartRepository {
    constructor(dao) { this.dao = dao; }
    async getCartById(id) { return await this.dao.getById(id); }
    async updateCart(id, data) { return await this.dao.update(id, data); }
}