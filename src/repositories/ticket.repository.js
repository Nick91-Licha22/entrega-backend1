export default class TicketRepository {
    constructor(dao) {
        this.dao = dao;
    }
    
    createTicket = async (data) => {
        return await this.dao.create(data);
    };
}