import { userModel } from "./models/user.model.js";

export default class UserDAO {
    async getByEmail(email) {
        return await userModel.findOne({ email });
    }
    async getById(id) {
        return await userModel.findById(id);
    }
    async update(id, data) {
        return await userModel.findByIdAndUpdate(id, data, { new: true });
    }
}