import express from "express";
import http from "http";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./productManager.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 
const parentDir = dirname(__dirname);

const productManager = new ProductManager(join(__dirname, "products.json"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(parentDir, "public"))); 

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.set('socketio', io);
app.set('productManager', productManager);
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

io.on("connection", (socket) => {
 console.log("Nuevo cliente conectado. ID:", socket.id);
});


server.listen(8080, () => {
 console.log("Servidor escuchando en el puerto 8080");
});