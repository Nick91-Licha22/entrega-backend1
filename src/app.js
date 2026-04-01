import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import path from 'path';

import viewsRouter from './routes/views.router.js';
import cartsRouter from './routes/carts.router.js';
import sessionsRouter from './routes/sessions.router.js';
import productsRouter from './routes/products.router.js';
import __dirname from './utils.js';
import initializePassport from './config/passport.config.js';

const app = express();

const hbs = handlebars.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: {
        multiply: (num1, num2) => (num1 * num2).toFixed(2),
        eq: (a, b) => a === b
    }
});

app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; style-src * 'unsafe-inline';");
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../public')));

initializePassport();
app.use(passport.initialize());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);

mongoose.connect(process.env.URI_MONGODB)
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch(err => console.error("❌ Error Mongo:", err));

app.listen(8080, () => console.log("🚀 S&N Verdulería: http://localhost:8080"));