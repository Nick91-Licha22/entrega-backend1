export default class CartRepository {
    constructor(dao) { this.dao = dao; }

    getCartById = async (id) => {
        
        return await this.dao.getById(id);
    }

    updateCart = async (id, cart) => {
        return await this.dao.update(id, cart);
    }

    createCart = async () => {
        return await this.dao.create();
    }
}