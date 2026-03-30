import { userModel } from "./models/user.model.js";

export default class UserDAO {
    async get() {
        return await userModel.find();
    }

    async getById(id) {
        return await userModel.findById(id);
    }

    async getByEmail(email) {
        return await userModel.findOne({ email });
    }

    async create(data) {
        return await userModel.create(data);
    }

    async update(id, data) {
        return await userModel.findByIdAndUpdate(id, data, { new: true });
    }
}