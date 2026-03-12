import dotenv from 'dotenv';
dotenv.config(); 

import express from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import sessionsRouter from './routes/sessions.router.js';
import viewsRouter from './routes/views.router.js';

import __dirname from './utils.js';
import initializePassport from './config/passport.config.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/../public`));
app.use(cookieParser());

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

initializePassport();
app.use(passport.initialize());

const MONGO_URI = process.env.URI_MONGODB; 

console.log("Intentando conectar a MongoDB...");

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Conectado a MongoDB con éxito"))
    .catch(error => {
        console.error("❌ Error al conectar a MongoDB:");
        console.log(error.message);
    });

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);

app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});