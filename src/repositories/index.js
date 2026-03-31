import Products from "../dao/mongo/products.mongo.js";
import Carts from "../dao/mongo/carts.mongo.js";
import UserDAO from "../dao/user.dao.js";
import TicketDAO from "../dao/ticket.dao.js";
import UserRepository from "./user.repository.js";
import ProductRepository from "./product.repository.js";
import CartRepository from "./cart.repository.js";
import TicketRepository from "./ticket.repository.js";

export const userService = new UserRepository(new UserDAO());
export const productService = new ProductRepository(new Products());
export const cartService = new CartRepository(new Carts());
export const ticketService = new TicketRepository(new TicketDAO());