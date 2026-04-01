import Products from "../dao/mongo/products.mongo.js"; 
import Carts from "../dao/mongo/carts.mongo.js";
import UserDAO from "../dao/user.dao.js";
import TicketDAO from "../dao/ticket.dao.js";

import UserRepository from "./user.repository.js";
import ProductRepository from "./product.repository.js";
import CartRepository from "./cart.repository.js";
import TicketRepository from "./ticket.repository.js";

// Instanciamos los DAOs según tu estructura de carpetas
const productDao = new Products();
const cartDao = new Carts();
const userDao = new UserDAO();
const ticketDao = new TicketDAO();

// Exportamos los servicios (Repositories) inyectando los DAOs
export const userService = new UserRepository(userDao);
export const productService = new ProductRepository(productDao);
export const cartService = new CartRepository(cartDao);
export const ticketService = new TicketRepository(ticketDao);