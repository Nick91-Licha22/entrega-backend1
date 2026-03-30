import { ticketModel } from "./models/ticket.model.js";

export default class TicketDAO {
    create = async (data) => {
        return await ticketModel.create(data);
    };
    
    getById = async (id) => {
        return await ticketModel.findById(id);
    };
}