import UserDTO from "../dto/user.dto.js";

export default class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getUserByEmail(email) {
        return await this.dao.getByEmail(email); 
    }

    async getUserById(id) {
        const user = await this.dao.getById(id);
        return new UserDTO(user); 
    }

    async updatePassword(id, newPassword) {
        return await this.dao.update(id, { password: newPassword });
    }
}