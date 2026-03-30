export default class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getUserByEmail = async (email) => {
        
        return await this.dao.getByEmail(email);
    }

    createUser = async (user) => {
        return await this.dao.create(user);
    }

    updateUser = async (id, user) => {
        return await this.dao.update(id, user);
    }
    
    getUserById = async (id) => {
        return await this.dao.getById(id);
    }
}