export default class CartRepository {
    constructor(dao) { this.dao = dao; }

    getCartById = async (id) => {
        const cart = await this.dao.getById(id);
        if (!cart) return null;
        
        return await cart.populate('products.product');
    }

    updateCart = async (id, cart) => {
        return await this.dao.update(id, cart);
    }
}