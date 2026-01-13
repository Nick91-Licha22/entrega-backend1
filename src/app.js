import express from "express";
import http from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import dotenv from "dotenv";
import { join } from "path";
import __dirname from "../dirname.js";

import { connectMongoDB } from "./config/db.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import { errorHandler } from "./middlewares/error.middleware.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);

connectMongoDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));

app.engine("handlebars", engine({
    helpers: {
    multiply: (a, b) => (Number(a) * Number(b)).toFixed(2),
    totalCart: (products) => {
        let total = 0;
        products.forEach(item => {
            total += item.product.price * item.quantity;
        });
        return total.toFixed(2);
    }
}
}));
app.set("view engine", "handlebars");
app.set("views", join(__dirname, "src", "views"));

app.set('socketio', io); 

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

app.use(errorHandler);

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado:", socket.id);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`🚀 Servidor listo en http://localhost:${PORT}`));