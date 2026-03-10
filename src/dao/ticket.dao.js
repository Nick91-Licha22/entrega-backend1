import { ticketModel } from "./models/ticket.model.js";

export default class TicketDAO {
    async create(data) { return await ticketModel.create(data); }
}