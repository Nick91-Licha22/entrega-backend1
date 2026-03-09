export default class TicketRepository {
    constructor(dao) { this.dao = dao; }
    async createTicket(data) { return await this.dao.create(data); }
}