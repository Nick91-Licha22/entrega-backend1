import express from "express";
import handlebars from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

const app = express();
const PORT = 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));

app.engine("handlebars", handlebars.engine());
app.set("views", join(__dirname, "views"));
app.set("view engine", "handlebars");

app.use("/", viewsRouter);          
app.use("/api/products", productsRouter); 
app.use("/api/carts", cartsRouter);       

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});